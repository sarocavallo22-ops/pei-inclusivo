import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { FamilyMember, Relationship, Gender } from '../types';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plus, Trash2, User, Users, Heart, Image as ImageIcon, Camera, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface GenogramEditorProps {
  members: FamilyMember[];
  relationships: Relationship[];
  onChange: (members: FamilyMember[], relationships: Relationship[]) => void;
  t: any;
  lang: string;
}

export default function GenogramEditor({ members, relationships, onChange, t, lang }: GenogramEditorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const RELATIONSHIP_TYPES = [
    { id: 'student', label: t.relations.student, gender: 'other' },
    { id: 'mother', label: t.relations.mother, gender: 'female' },
    { id: 'father', label: t.relations.father, gender: 'male' },
    { id: 'sister', label: t.relations.sister, gender: 'female' },
    { id: 'brother', label: t.relations.brother, gender: 'male' },
    { id: 'gmother_m', label: t.relations.gmother_m, gender: 'female' },
    { id: 'gfather_m', label: t.relations.gfather_m, gender: 'male' },
    { id: 'gmother_p', label: t.relations.gmother_p, gender: 'female' },
    { id: 'gfather_p', label: t.relations.gfather_p, gender: 'male' },
    { id: 'uncle', label: t.relations.uncle, gender: 'male' },
    { id: 'aunt', label: t.relations.aunt, gender: 'female' },
    { id: 'cousin', label: t.relations.cousin, gender: 'other' },
  ];

  const addMember = (relType: typeof RELATIONSHIP_TYPES[0]) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newMember: FamilyMember = {
      id,
      name: relType.label,
      relation: relType.id,
      gender: relType.gender as Gender,
      x: 400 + (Math.random() - 0.5) * 150,
      y: 300 + (Math.random() - 0.5) * 150,
    };

    const newMembers = [...members, newMember];
    let newRelationships = [...relationships];

    const student = members.find(m => m.relation === 'student');
    const mother = members.find(m => m.relation === 'mother');
    const father = members.find(m => m.relation === 'father');

    // Complex Auto-link logic
    if (relType.id === 'mother') {
      if (student) newRelationships.push({ sourceId: id, targetId: student.id, type: 'parent-child' });
      if (father) newRelationships.push({ sourceId: id, targetId: father.id, type: 'spouse' });
      members.filter(m => ['gmother_m', 'gfather_m'].includes(m.relation)).forEach(m => {
        newRelationships.push({ sourceId: m.id, targetId: id, type: 'parent-child' });
      });
      members.filter(m => ['sister', 'brother'].includes(m.relation)).forEach(m => {
        newRelationships.push({ sourceId: id, targetId: m.id, type: 'parent-child' });
      });
    } else if (relType.id === 'father') {
      if (student) newRelationships.push({ sourceId: id, targetId: student.id, type: 'parent-child' });
      if (mother) newRelationships.push({ sourceId: id, targetId: mother.id, type: 'spouse' });
      members.filter(m => ['gmother_p', 'gfather_p'].includes(m.relation)).forEach(m => {
        newRelationships.push({ sourceId: m.id, targetId: id, type: 'parent-child' });
      });
      members.filter(m => ['sister', 'brother'].includes(m.relation)).forEach(m => {
        newRelationships.push({ sourceId: id, targetId: m.id, type: 'parent-child' });
      });
    } else if (['sister', 'brother'].includes(relType.id)) {
      if (student) newRelationships.push({ sourceId: id, targetId: student.id, type: 'sibling' });
      if (mother) newRelationships.push({ sourceId: id, targetId: mother.id, type: 'parent-child' });
      if (father) newRelationships.push({ sourceId: id, targetId: father.id, type: 'parent-child' });
    } else if (['gmother_m', 'gfather_m'].includes(relType.id)) {
      if (mother) newRelationships.push({ sourceId: id, targetId: mother.id, type: 'parent-child' });
      else if (student) newRelationships.push({ sourceId: id, targetId: student.id, type: 'parent-child' });
    } else if (['gmother_p', 'gfather_p'].includes(relType.id)) {
      if (father) newRelationships.push({ sourceId: id, targetId: father.id, type: 'parent-child' });
      else if (student) newRelationships.push({ sourceId: id, targetId: student.id, type: 'parent-child' });
    } else if (student && relType.id !== 'student') {
      newRelationships.push({ sourceId: id, targetId: student.id, type: 'parent-child' });
    }

    onChange(newMembers, newRelationships);
    setSelectedMemberId(id);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedMemberId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateMember(selectedMemberId, { photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMember = (id: string) => {
    const newMembers = members.filter(m => m.id !== id);
    const newRelationships = relationships.filter(r => r.sourceId !== id && r.targetId !== id);
    onChange(newMembers, newRelationships);
    if (selectedMemberId === id) setSelectedMemberId(null);
  };

  const updateMember = (id: string, updates: Partial<FamilyMember>) => {
    const newMembers = members.map(m => m.id === id ? { ...m, ...updates } : m);
    onChange(newMembers, relationships);
  };

  const toggleRelationship = (targetId: string) => {
    if (!selectedMemberId || selectedMemberId === targetId) return;

    const existingIndex = relationships.findIndex(
      r => (r.sourceId === selectedMemberId && r.targetId === targetId) ||
           (r.sourceId === targetId && r.targetId === selectedMemberId)
    );

    if (existingIndex > -1) {
      const newRelationships = [...relationships];
      newRelationships.splice(existingIndex, 1);
      onChange(members, newRelationships);
    } else {
      const newRelationship: Relationship = {
        sourceId: selectedMemberId,
        targetId: targetId,
        type: 'parent-child', // Default
      };
      onChange(members, [...relationships, newRelationship]);
    }
    setIsConnecting(false);
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear for re-render to ensure order

    // Background House
    svg.append('image')
      .attr('xlink:href', 'https://picsum.photos/seed/house-bg/1200/800?blur=2')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('preserveAspectRatio', 'xMidYMid slice')
      .attr('opacity', 0.15);

    // Draw lines FIRST (behind nodes)
    svg.selectAll<SVGLineElement, Relationship>('.rel-line')
      .data(relationships)
      .join('line')
      .attr('class', 'rel-line')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', d => d.type === 'spouse' ? '5,5' : 'none')
      .attr('x1', r => members.find(m => m.id === r.sourceId)?.x || 0)
      .attr('y1', r => members.find(m => m.id === r.sourceId)?.y || 0)
      .attr('x2', r => members.find(m => m.id === r.targetId)?.x || 0)
      .attr('y2', r => members.find(m => m.id === r.targetId)?.y || 0);

    const drag = d3.drag<SVGGElement, FamilyMember>()
      .on('drag', (event, d) => {
        updateMember(d.id, { x: event.x, y: event.y });
      });

    const nodes = svg.selectAll<SVGGElement, FamilyMember>('.member-node')
      .data(members, d => d.id)
      .join('g')
      .attr('class', 'member-node cursor-move')
      .style('touch-action', 'none')
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .on('click', (event, d) => {
        event.stopPropagation();
        if (isConnecting) {
          toggleRelationship(d.id);
        } else {
          setSelectedMemberId(d.id);
        }
      })
      .call(drag as any);

    nodes.append('circle')
      .attr('r', 45) // Larger circles
      .attr('fill', (d: any) => d.gender === 'female' ? '#fff1f2' : d.gender === 'male' ? '#eff6ff' : 'white')
      .attr('stroke', (d: any) => d.id === selectedMemberId ? '#3b82f6' : '#e2e8f0')
      .attr('stroke-width', (d: any) => d.id === selectedMemberId ? 5 : 3);

    nodes.append('clipPath')
      .attr('id', d => `clip-${d.id}`)
      .append('circle')
      .attr('r', 42);

    nodes.append('image')
      .attr('class', 'member-photo')
      .attr('width', 84)
      .attr('height', 84)
      .attr('x', -42)
      .attr('y', -42)
      .attr('clip-path', d => `url(#clip-${d.id})`)
      .attr('preserveAspectRatio', 'xMidYMid slice')
      .attr('xlink:href', (d: any) => {
        if (d.photo) return d.photo;
        const style = d.gender === 'female' ? 'avataaars' : d.gender === 'male' ? 'pixel-art' : 'bottts';
        return `https://api.dicebear.com/7.x/${style}/svg?seed=${d.id}&backgroundColor=b6e3f4`;
      });

    nodes.append('text')
      .attr('class', 'member-name')
      .attr('y', 65)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', '900')
      .attr('fill', '#1e293b')
      .text((d: any) => d.name);

    nodes.append('text')
      .attr('class', 'member-rel')
      .attr('y', 82)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .attr('fill', '#64748b')
      .text((d: any) => {
        const rel = RELATIONSHIP_TYPES.find(r => r.id === d.relation);
        return rel ? rel.label : d.relation;
      });

  }, [members, relationships, selectedMemberId, isConnecting, lang]);

  const selectedMember = members.find(m => m.id === selectedMemberId);

  return (
    <div className="flex flex-col gap-4 h-full">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handlePhotoUpload}
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50 p-6 rounded-3xl border border-slate-200 gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900">{t.title}</h3>
          <p className="text-sm text-slate-500 font-medium">{t.desc}</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Select onValueChange={(val) => {
            const rel = RELATIONSHIP_TYPES.find(r => r.id === val);
            if (rel) addMember(rel);
          }}>
            <SelectTrigger className="w-[200px] h-12 rounded-2xl bg-white border-slate-200 font-bold">
              <Plus size={18} className="mr-2" />
              <SelectValue placeholder={t.placeholderSelect} />
            </SelectTrigger>
            <SelectContent>
              {RELATIONSHIP_TYPES.map(rel => (
                <SelectItem key={rel.id} value={rel.id} disabled={rel.id === 'student' && members.some(m => m.relation === 'student')}>
                  {rel.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        <div className="lg:col-span-2 relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
          <svg 
            ref={svgRef} 
            className="w-full h-full min-h-[500px]"
            style={{ touchAction: 'none' }}
            onClick={() => {
              setSelectedMemberId(null);
              setIsConnecting(false);
            }}
          />
          {isConnecting && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-pulse">
              Seleziona un altro membro per creare un legame
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {selectedMember ? (
            <Card className="p-6 border-blue-100 bg-blue-50/30">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    selectedMember.gender === 'female' ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600"
                  )}>
                    <User size={20} />
                  </div>
                  <h4 className="font-bold text-slate-900">{t.details}</h4>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-slate-400 hover:text-red-600"
                  onClick={() => removeMember(selectedMember.id)}
                >
                  <Trash2 size={18} />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t.name}</Label>
                  <Input 
                    value={selectedMember.name} 
                    onChange={(e) => updateMember(selectedMember.id, { name: e.target.value })}
                    placeholder={t.name}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t.relation}</Label>
                  <Select 
                    value={selectedMember.relation} 
                    onValueChange={(val) => updateMember(selectedMember.id, { relation: val })}
                  >
                    <SelectTrigger className="h-12 rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATIONSHIP_TYPES.map(rel => (
                        <SelectItem key={rel.id} value={rel.id}>{rel.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t.uploadPhoto}</Label>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-2 h-12 rounded-2xl"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={18} /> {t.uploadPhoto}
                    </Button>
                    {selectedMember.photo && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-12 w-12 rounded-2xl text-red-500"
                        onClick={() => updateMember(selectedMember.id, { photo: undefined })}
                      >
                        <Trash2 size={18} />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t.age}</Label>
                    <Input 
                      type="number"
                      value={selectedMember.age || ''} 
                      onChange={(e) => updateMember(selectedMember.id, { age: parseInt(e.target.value) || undefined })}
                      placeholder={t.age}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.job}</Label>
                    <Input 
                      value={selectedMember.job || ''} 
                      onChange={(e) => updateMember(selectedMember.id, { job: e.target.value })}
                      placeholder={t.job}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t.gender}</Label>
                  <div className="flex gap-2">
                    {(['male', 'female', 'other'] as Gender[]).map((g) => (
                      <Button
                        key={g}
                        variant={selectedMember.gender === g ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1 capitalize"
                        onClick={() => updateMember(selectedMember.id, { gender: g })}
                      >
                        {g === 'male' ? t.male : g === 'female' ? t.female : t.other}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <Button 
                    className="w-full gap-2" 
                    variant={isConnecting ? "secondary" : "outline"}
                    onClick={() => setIsConnecting(!isConnecting)}
                  >
                    <Heart size={18} className={isConnecting ? "fill-current" : ""} />
                    {isConnecting ? "Annulla Legame" : "Crea Legame"}
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-8 border-dashed border-2 flex flex-col items-center justify-center text-center text-slate-400 h-full">
              <Users size={48} className="mb-4 opacity-20" />
              <p>Seleziona un membro nel grafico per modificarne i dettagli o creare legami.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
