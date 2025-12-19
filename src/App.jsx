// src/App.jsx (Versão Corrigida para Canvas - Sem Dependências Externas)

// 1. IMPORTS
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
// Substituindo FontAwesome por Lucide-React (Nativo)
import {
  PlusCircle, ChevronLeft, ChevronRight,
  Edit2, X, Ban, CheckCircle, RotateCcw,
  Upload, Download, Printer,
  Save, Plus, Calendar as CalendarIcon
} from 'lucide-react';

// Placeholder para o logo
const senaiLogo = "https://upload.wikimedia.org/wikipedia/commons/8/8c/SENAI_S%C3%A3o_Paulo_logo.png";

// 2. CONSTANTES E COMPONENTES AUXILIARES
const DEFAULT_COLORS = {
  class: 'bg-blue-200',
  holiday: 'bg-red-300',
  makeup: 'bg-green-300',
  emenda: 'bg-purple-200',
  weekend: 'bg-gray-200',
};

const COLOR_PALETTE = [
  'bg-blue-300', 'bg-green-300', 'bg-red-300', 'bg-yellow-300', 'bg-purple-300',
  'bg-orange-300', 'bg-pink-300', 'bg-indigo-300', 'bg-teal-300', 'bg-cyan-300',
  'bg-lime-300', 'bg-fuchsia-300', 'bg-rose-300', 'bg-sky-300', 'bg-amber-300',
  'bg-violet-300'
];

const CURRICULAR_UNIT_COLORS = [
  'bg-teal-400', 'bg-cyan-400', 'bg-lime-400', 'bg-fuchsia-400', 'bg-rose-400',
  'bg-sky-400', 'bg-amber-400', 'bg-violet-400'
];

const WEEK_DAYS_LABELS = { 0: 'Dom', 1: 'Seg', 2: 'Ter', 3: 'Qua', 4: 'Qui', 5: 'Sex', 6: 'Sáb' };

const MONTH_LABELS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const formatDateToISO = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()).toISOString().split('T')[0];
};

const ColorPicker = ({ position, onSelectColor, onClose }) => (
  <div className="fixed z-50 p-2 bg-white border rounded-lg shadow-xl" style={{ top: position.y, left: position.x }} onMouseLeave={onClose}>
    <div className="grid grid-cols-4 gap-2">
      {COLOR_PALETTE.map(colorClass => <div key={colorClass} className={`w-8 h-8 rounded-full cursor-pointer hover:scale-110 transition-transform ${colorClass}`} onClick={() => onSelectColor(colorClass)} />)}
    </div>
  </div>
);

const CalendarControls = ({ turmaName, onTurmaNameChange, onDatesChange, onAddHoliday, onAddMakeupDay, classWeekDays, onClassWeekDaysChange }) => {
  const [holidayInput, setHolidayInput] = useState('');
  const [makeupInput, setMakeupInput] = useState('');

  const handleAddDate = (type) => (e) => {
    e.preventDefault();
    if (type === 'holiday' && holidayInput) { onAddHoliday(holidayInput); setHolidayInput(''); }
    else if (type === 'makeup' && makeupInput) { onAddMakeupDay(makeupInput); setMakeupInput(''); }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-md space-y-6 print:hidden">
      <h2 className="text-2xl font-bold text-gray-700">Configurações Gerais</h2>
      <div>
        <label htmlFor="turmaName" className="block text-sm font-medium text-gray-600 mb-1">Nome da Turma</label>
        <input type="text" id="turmaName" name="turmaName" value={turmaName} onChange={onTurmaNameChange} placeholder="Ex: Engenharia de Software 2025" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-600 mb-1">Início do Semestre</label>
          <input type="date" id="startDate" name="startDate" onChange={onDatesChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-600 mb-1">Fim do Semestre</label>
          <input type="date" id="endDate" name="endDate" onChange={onDatesChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Dias de aula na semana (Geral)</label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {Object.entries(WEEK_DAYS_LABELS).map(([dayIndex, label]) => (
            <label key={dayIndex} className="flex items-center justify-center p-2 border rounded-md cursor-pointer has-[:checked]:bg-blue-500 has-[:checked]:text-white has-[:checked]:border-blue-500 transition-colors">
              <input type="checkbox" className="sr-only" checked={classWeekDays.includes(parseInt(dayIndex))} onChange={() => onClassWeekDaysChange(parseInt(dayIndex))} />
              <span className="font-semibold text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>
      <form onSubmit={handleAddDate('holiday')} className="space-y-2">
        <label htmlFor="holiday" className="block text-sm font-medium text-gray-600">Adicionar Feriado</label>
        <div className="flex items-center gap-2">
          <input type="date" id="holiday" value={holidayInput} onChange={(e) => setHolidayInput(e.target.value)} className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500" />
          <button type="submit" className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </form>
      <form onSubmit={handleAddDate('makeup')} className="space-y-2">
        <label htmlFor="makeup" className="block text-sm font-medium text-gray-600">Adicionar Dia de Reposição</label>
        <div className="flex items-center gap-2">
          <input type="date" id="makeup" value={makeupInput} onChange={(e) => setMakeupInput(e.target.value)} className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500" />
          <button type="submit" className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

const CurricularUnitControls = ({ onAddUnit, onUpdateUnit, editingUnit, onCancelEdit, generalWeekDays }) => {
  const initialFormState = { name: '', startDate: '', endDate: '', weekDays: [] };
  const [unit, setUnit] = useState(initialFormState);
  const isEditing = !!editingUnit;

  useEffect(() => {
    if (isEditing) {
      setUnit(editingUnit);
    } else {
      setUnit(initialFormState);
    }
  }, [editingUnit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUnit(prev => ({ ...prev, [name]: value }));
  };

  const handleWeekDayChange = (dayIndex) => {
    setUnit(prev => {
      const newWeekDays = prev.weekDays.includes(dayIndex)
        ? prev.weekDays.filter(d => d !== dayIndex)
        : [...prev.weekDays, dayIndex];
      return { ...prev, weekDays: newWeekDays.sort() };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (unit.name && unit.startDate && unit.endDate && unit.weekDays.length > 0) {
      if (isEditing) {
        onUpdateUnit(unit);
      } else {
        onAddUnit(unit);
      }
      setUnit(initialFormState);
    } else {
      alert('Por favor, preencha todos os campos da Unidade Curricular.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-md space-y-6 print:hidden">
      <h2 className="text-2xl font-bold text-gray-700">{isEditing ? 'Editar Unidade Curricular' : 'Adicionar Unidade Curricular'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Nome da UC</label>
          <input type="text" name="name" value={unit.name} onChange={handleInputChange} placeholder="Ex: Matemática" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-600 mb-1">Início</label>
            <input type="date" name="startDate" value={unit.startDate} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-600 mb-1">Fim</label>
            <input type="date" name="endDate" value={unit.endDate} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Dias da UC</label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {Object.entries(WEEK_DAYS_LABELS).map(([dayIndex, label]) => {
              const dayInt = parseInt(dayIndex);
              const isDisabled = !generalWeekDays.includes(dayInt);
              return (
                <label key={dayIndex} className={`flex items-center justify-center p-2 border rounded-md transition-colors ${isDisabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'cursor-pointer has-[:checked]:bg-teal-500 has-[:checked]:text-white has-[:checked]:border-teal-500'}`}>
                  <input type="checkbox" className="sr-only" checked={unit.weekDays.includes(dayInt)} onChange={() => handleWeekDayChange(dayInt)} disabled={isDisabled} />
                  <span className="font-semibold text-sm">{label}</span>
                </label>
              );
            })}
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing && (
            <button type="button" onClick={onCancelEdit} className="w-full px-4 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition-colors">Cancelar</button>
          )}
          <button type="submit" className="w-full px-4 py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-colors flex items-center justify-center">
            {isEditing ? (
              <>Salvar Alterações</>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar UC
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const CalendarGrid = ({ month, year, dates, colors, individualDayColors, classWeekDays, onDayClick }) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const getDayStyle = useCallback((day) => {
    const dateStr = formatDateToISO(new Date(year, month, day));
    const dayOfWeek = new Date(year, month, day).getDay();

    if (individualDayColors[dateStr]) return { type: 'individual', className: `${individualDayColors[dateStr]} text-white` };
    if (dates.holidays.has(dateStr)) return { type: 'holiday', className: `${colors.holiday} text-white` };
    if (dates.makeupDays.has(dateStr)) return { type: 'makeup', className: `${colors.makeup} text-white` };
    if (dates.emendas.has(dateStr)) return { type: 'emenda', className: `${colors.emenda} text-white` };

    for (const unit of dates.curricularUnits) {
      if (dateStr >= unit.startDate && dateStr <= unit.endDate && unit.weekDays.includes(dayOfWeek)) {
        return { type: 'curricular', className: `${unit.color} text-gray-800` };
      }
    }

    if (dates.startDate && dates.endDate && dateStr >= dates.startDate && dateStr <= dates.endDate) {
      if (classWeekDays.includes(dayOfWeek)) return { type: 'class', className: `${colors.class} text-gray-800` };
      return { type: 'weekend', className: `${colors.weekend} text-gray-500` };
    }
    return { type: 'default', className: 'bg-white text-gray-700' };
  }, [year, month, dates, colors, individualDayColors, classWeekDays]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg break-inside-avoid mb-6 print:shadow-none print:border print:border-gray-300">
      <div className="mb-4 text-center">
        <h3 className="text-xl font-bold text-gray-700 uppercase tracking-wide">{MONTH_LABELS[month]} <span className="text-gray-400">{year}</span></h3>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center font-bold text-gray-600 mb-2">
        {Object.values(WEEK_DAYS_LABELS).map(day => <div key={day} className="text-xs uppercase">{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="border-none"></div>)}
        {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
          const day = dayIndex + 1;
          const { className } = getDayStyle(day);
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

          return (
            <div key={day} onClick={(e) => onDayClick(e, 'individual', formatDateToISO(new Date(year, month, day)))} className={`h-10 md:h-14 flex items-center justify-center border rounded-md transition-all duration-200 cursor-pointer hover:shadow-md ${className} ${isToday ? 'ring-2 ring-offset-2 ring-blue-500 print:ring-0' : ''} print:h-12 print:text-sm`}>
              <span className="text-sm font-medium">{dayIndex + 1}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// 3. O COMPONENTE PRINCIPAL
export default function App() {
  const fileInputRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [turmaName, setTurmaName] = useState('');
  const [dates, setDates] = useState({
    startDate: null, endDate: null, holidays: new Set(),
    makeupDays: new Set(), emendas: new Set(), curricularUnits: [],
  });
  const [colors, setColors] = useState(DEFAULT_COLORS);
  const [individualDayColors, setIndividualDayColors] = useState({});
  const [classWeekDays, setClassWeekDays] = useState([1, 2, 3, 4, 5]);
  const [colorPickerState, setColorPickerState] = useState({ visible: false, position: null, target: null });
  const [editingUnit, setEditingUnit] = useState(null);

  const handleDateChange = (e) => setDates(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const addHolidayAndBridge = (dateStr) => {
    if (!dateStr) return;
    const isoDate = formatDateToISO(dateStr);
    setDates(prev => {
      const newHolidays = new Set(prev.holidays).add(isoDate);
      const newEmendas = new Set(prev.emendas);
      const holidayDate = new Date(isoDate + 'T12:00:00');
      const dayOfWeek = holidayDate.getDay();
      if (dayOfWeek === 2) newEmendas.add(formatDateToISO(new Date(holidayDate.setDate(holidayDate.getDate() - 1))));
      else if (dayOfWeek === 4) {
        newEmendas.add(formatDateToISO(new Date(new Date(holidayDate).setDate(holidayDate.getDate() + 1))));
        newEmendas.add(formatDateToISO(new Date(new Date(holidayDate).setDate(holidayDate.getDate() + 2))));
      }
      return { ...prev, holidays: newHolidays, emendas: newEmendas };
    });
  };

  const addMakeupDay = (dateStr) => {
    if (!dateStr) return;
    setDates(prev => ({ ...prev, makeupDays: new Set(prev.makeupDays).add(formatDateToISO(dateStr)) }));
  };

  const removeDateFromList = (listType, date) => {
    if (listType === 'holidays') {
      setDates(prev => {
        const newHolidays = new Set(prev.holidays); newHolidays.delete(date);
        const newEmendas = new Set(prev.emendas);
        const holidayDate = new Date(date + 'T12:00:00');
        const dayOfWeek = holidayDate.getDay();
        if (dayOfWeek === 2) newEmendas.delete(formatDateToISO(new Date(holidayDate.setDate(holidayDate.getDate() - 1))));
        else if (dayOfWeek === 4) {
          newEmendas.delete(formatDateToISO(new Date(new Date(holidayDate).setDate(holidayDate.getDate() + 1))));
          newEmendas.delete(formatDateToISO(new Date(new Date(holidayDate).setDate(holidayDate.getDate() + 2))));
        }
        return { ...prev, holidays: newHolidays, emendas: newEmendas };
      });
    } else {
      setDates(prev => {
        const newSet = new Set(prev[listType]); newSet.delete(date);
        return { ...prev, [listType]: newSet };
      });
    }
  };

  const handleAddUnit = (newUnit) => {
    setDates(prev => {
      const newUnitWithIdAndColor = { ...newUnit, id: Date.now(), color: CURRICULAR_UNIT_COLORS[prev.curricularUnits.length % CURRICULAR_UNIT_COLORS.length] };
      return { ...prev, curricularUnits: [...prev.curricularUnits, newUnitWithIdAndColor] };
    });
  };

  const handleUpdateUnit = (updatedUnit) => {
    setDates(prev => ({ ...prev, curricularUnits: prev.curricularUnits.map(unit => unit.id === updatedUnit.id ? updatedUnit : unit) }));
    setEditingUnit(null);
  };

  const handleRemoveUnit = (unitId) => {
    setDates(prev => ({ ...prev, curricularUnits: prev.curricularUnits.filter(u => u.id !== unitId) }));
  };

  const handleClassWeekDaysChange = (dayIndex) => setClassWeekDays(prev => prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex].sort());

  const handleOpenColorPicker = (event, type, targetIdentifier) => {
    event.stopPropagation();
    setColorPickerState({ visible: true, position: { x: event.clientX, y: event.clientY }, target: { type, identifier: targetIdentifier } });
  };

  const handleSelectColor = (colorClass) => {
    const { type, identifier } = colorPickerState.target;
    if (type === 'global') {
      setColors(prev => ({ ...prev, [identifier]: colorClass }));
    } else if (type === 'individual') {
      setIndividualDayColors(prev => ({ ...prev, [identifier]: colorClass }));
    } else if (type === 'curricular') {
      setDates(prev => ({ ...prev, curricularUnits: prev.curricularUnits.map(unit => unit.id === identifier ? { ...unit, color: colorClass } : unit) }));
    }
    setColorPickerState({ visible: false, position: null, target: null });
  };

  const handleRestoreColors = () => {
    setColors(DEFAULT_COLORS);
    setIndividualDayColors({});
  };

  const handleExportJson = () => {
    const dataToSave = { turmaName, dates: { ...dates, holidays: [...dates.holidays], makeupDays: [...dates.makeupDays], emendas: [...dates.emendas] }, colors, individualDayColors, classWeekDays, };
    const jsonString = JSON.stringify(dataToSave, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${turmaName.replace(/ /g, '_') || 'calendario'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (event) => {
    const file = event.target.files[0];
    if (!file) { return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const loadedData = JSON.parse(text);
        setTurmaName(loadedData.turmaName || '');
        setColors(loadedData.colors || DEFAULT_COLORS);
        setIndividualDayColors(loadedData.individualDayColors || {});
        setClassWeekDays(loadedData.classWeekDays || [1, 2, 3, 4, 5]);
        if (loadedData.dates) {
          setDates({
            startDate: loadedData.dates.startDate,
            endDate: loadedData.dates.endDate,
            holidays: new Set(loadedData.dates.holidays || []),
            makeupDays: new Set(loadedData.dates.makeupDays || []),
            emendas: new Set(loadedData.dates.emendas || []),
            curricularUnits: loadedData.dates.curricularUnits || [],
          });
        }
      } catch (error) {
        console.error("Erro ao carregar o arquivo JSON:", error);
        alert("Erro ao carregar o arquivo. Verifique se é um arquivo JSON válido gerado por este aplicativo.");
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handlePrint = () => {
    // Usamos a função nativa de impressão, que permite "Salvar como PDF"
    window.print();
  };

  // Helper para gerar a lista de meses entre as datas
  const monthsList = useMemo(() => {
    if (!dates.startDate || !dates.endDate) {
      // Se não houver datas, mostra o mês atual
      return [{ month: new Date().getMonth(), year: new Date().getFullYear() }];
    }

    const start = new Date(dates.startDate);
    const end = new Date(dates.endDate);
    const months = [];

    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    // Adicionar margem de segurança para o fim
    const endDate = new Date(end.getFullYear(), end.getMonth(), 1);

    while (current <= endDate) {
      months.push({ month: current.getMonth(), year: current.getFullYear() });
      current.setMonth(current.getMonth() + 1);
    }
    return months;
  }, [dates.startDate, dates.endDate]);

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-800 print:bg-white print:p-0" onClick={() => colorPickerState.visible && setColorPickerState({ visible: false, position: null, target: null })}>
      {/* Estilos específicos para impressão */}
      <style>{`
          @media print {
            body { -webkit-print-color-adjust: exact; }
            .print\\:hidden { display: none !important; }
            .print\\:shadow-none { box-shadow: none !important; }
            .print\\:border { border: 1px solid #ddd !important; }
            .print\\:h-12 { height: 3rem !important; }
            .print\\:text-sm { font-size: 0.875rem !important; }
            .print\\:p-0 { padding: 0 !important; }
          }
        `}</style>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 print:block">

        {/* Sidebar de Configurações - Escondido na impressão */}
        <div className="lg:col-span-4 space-y-6 overflow-y-auto max-h-screen pb-20 custom-scrollbar print:hidden">
          <div className="bg-white p-6 rounded-xl shadow-md flex justify-center items-center">
            <img src={senaiLogo} alt="SENAI Logo" className="h-16 object-contain" />
          </div>

          <CalendarControls
            turmaName={turmaName}
            onTurmaNameChange={(e) => setTurmaName(e.target.value)}
            onDatesChange={handleDateChange}
            onAddHoliday={addHolidayAndBridge}
            onAddMakeupDay={addMakeupDay}
            classWeekDays={classWeekDays}
            onClassWeekDaysChange={handleClassWeekDaysChange}
          />

          <CurricularUnitControls
            onAddUnit={handleAddUnit}
            onUpdateUnit={handleUpdateUnit}
            editingUnit={editingUnit}
            onCancelEdit={() => setEditingUnit(null)}
            generalWeekDays={classWeekDays}
          />

          {/* Lista de UCs Adicionadas */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold mb-4 text-gray-700">Unidades Curriculares</h3>
            {dates.curricularUnits.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhuma UC adicionada.</p>
            ) : (
              <div className="space-y-2">
                {dates.curricularUnits.map(unit => (
                  <div key={unit.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full cursor-pointer border border-gray-300 ${unit.color}`}
                        onClick={(e) => handleOpenColorPicker(e, 'curricular', unit.id)}
                        title="Clique para mudar a cor"
                      />
                      <div className="text-sm">
                        <span className="font-semibold block">{unit.name}</span>
                        <span className="text-xs text-gray-500">{new Date(unit.startDate).toLocaleDateString()} - {new Date(unit.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setEditingUnit(unit)} className="p-1 text-blue-500 hover:text-blue-700">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleRemoveUnit(unit.id)} className="p-1 text-red-500 hover:text-red-700">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Área de Botões */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <h3 className="text-lg font-bold text-gray-700">Ações</h3>

            {/* Input de arquivo oculto */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".json"
              onChange={handleImportJson}
            />

            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => fileInputRef.current.click()} className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center">
                <Upload className="w-4 h-4 mr-2" /> Carregar JSON
              </button>
              <button onClick={handleExportJson} className="w-full py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors flex items-center justify-center">
                <Download className="w-4 h-4 mr-2" /> Salvar JSON
              </button>
            </div>

            <button onClick={handleRestoreColors} className="w-full py-2 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center">
              <RotateCcw className="w-4 h-4 mr-2" /> Restaurar Cores
            </button>

            <button
              onClick={handlePrint}
              className="w-full py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-colors shadow-sm flex items-center justify-center"
            >
              <Printer className="w-4 h-4 mr-2" />
              Salvar PDF / Imprimir
            </button>
          </div>
        </div>

        {/* Área Principal - Calendário */}
        <div className="lg:col-span-8 bg-white p-8 rounded-xl shadow-xl overflow-x-auto min-h-[600px] print:col-span-12 print:shadow-none print:p-0 print:overflow-visible">
          <div className="text-center mb-8 border-b pb-4">
            {/* Logo só aparece na impressão na parte de cima */}
            <img src={senaiLogo} alt="SENAI Logo" className="h-12 object-contain mx-auto mb-2 hidden print:block" />

            <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-wider mb-2">{turmaName || 'Calendário Acadêmico'}</h1>
            {dates.startDate && dates.endDate && (
              <p className="text-gray-500">
                {new Date(dates.startDate).toLocaleDateString()} a {new Date(dates.endDate).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-3 print:gap-4">
            {monthsList.map((m, idx) => (
              <CalendarGrid
                key={`${m.month}-${m.year}`}
                month={m.month}
                year={m.year}
                dates={dates}
                colors={colors}
                individualDayColors={individualDayColors}
                classWeekDays={classWeekDays}
                onDayClick={handleOpenColorPicker}
              />
            ))}
          </div>

          {(!dates.startDate || !dates.endDate) && (
            <div className="text-center py-20 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 mt-4 print:hidden">
              <PlusCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Defina a Data de Início e Fim para visualizar todos os meses.</p>
            </div>
          )}
        </div>
      </div>

      {/* Color Picker Flutuante */}
      {colorPickerState.visible && (
        <ColorPicker
          position={colorPickerState.position}
          onSelectColor={handleSelectColor}
          onClose={() => setColorPickerState({ visible: false, position: null, target: null })}
        />
      )}
    </div>
  );
}