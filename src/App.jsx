// src/App.jsx (Versão Final e Corrigida)

// 1. IMPORTS - Todos juntos no topo do arquivo
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import senaiLogo from './images/senai-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPlusCircle, faChevronLeft, faChevronRight, 
    faEdit, faTimes, faBan, faCheckCircle, faUndo, 
    faUpload, faDownload, faFilePdf, 
    faFloppyDisk,
    faPlus
} from '@fortawesome/free-solid-svg-icons';


// 2. CONSTANTES E COMPONENTES AUXILIARES - Definidos ANTES do componente principal App
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

const formatDateToISO = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()).toISOString().split('T')[0];
};

const ColorPicker = ({ position, onSelectColor, onClose }) => (
  <div className="fixed z-20 p-2 bg-white border rounded-lg shadow-xl" style={{ top: position.y, left: position.x }} onMouseLeave={onClose}>
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
    <div className="p-6 bg-gray-50 rounded-xl shadow-md space-y-6">
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
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />Adicionar
                </button>
            </div>
        </form>
        <form onSubmit={handleAddDate('makeup')} className="space-y-2">
            <label htmlFor="makeup" className="block text-sm font-medium text-gray-600">Adicionar Dia de Reposição</label>
            <div className="flex items-center gap-2">
                <input type="date" id="makeup" value={makeupInput} onChange={(e) => setMakeupInput(e.target.value)} className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500" />
                <button type="submit" className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors">
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />Adicionar
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
        <div className="p-6 bg-gray-50 rounded-xl shadow-md space-y-6">
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
                    <button type="submit" className="w-full px-4 py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-colors">
                      {isEditing ? (
                        <>
                            Salvar Alterações
                        </>
                      ) : (
                        <>
                            <FontAwesomeIcon icon={faPlus} className="mr-2" /> 
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
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="grid grid-cols-7 gap-2 text-center font-bold text-gray-600">
        {Object.values(WEEK_DAYS_LABELS).map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-2">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="border rounded-md"></div>)}
        {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
          const day = dayIndex + 1;
          const { className } = getDayStyle(day);
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
          
          return (
            <div key={day} onClick={(e) => onDayClick(e, 'individual', formatDateToISO(new Date(year, month, day)))} className={`h-16 md:h-20 flex items-center justify-center border rounded-md transition-all duration-200 cursor-pointer hover:shadow-md ${className} ${isToday ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}>
              <span className="text-lg font-medium">{dayIndex + 1}</span>
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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const calendarPdfRef = useRef(null);

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
        const newUnitWithIdAndColor = {
            ...newUnit,
            id: Date.now(),
            color: CURRICULAR_UNIT_COLORS[prev.curricularUnits.length % CURRICULAR_UNIT_COLORS.length]
        };
        return { ...prev, curricularUnits: [...prev.curricularUnits, newUnitWithIdAndColor] };
    });
  };

  const handleUpdateUnit = (updatedUnit) => {
      setDates(prev => ({
          ...prev,
          curricularUnits: prev.curricularUnits.map(unit => unit.id === updatedUnit.id ? updatedUnit : unit)
      }));
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
          setDates(prev => ({
              ...prev,
              curricularUnits: prev.curricularUnits.map(unit => unit.id === identifier ? { ...unit, color: colorClass } : unit)
          }));
      }
      setColorPickerState({ visible: false, position: null, target: null });
  };

  const handleRestoreColors = () => { setColors(DEFAULT_COLORS); setIndividualDayColors({}); };

  const handleExportJson = () => {
    const dataToSave = {
        turmaName,
        dates,
        colors,
        individualDayColors,
        classWeekDays,
    };

    const jsonString = JSON.stringify(dataToSave, (key, value) => {
        if (value instanceof Set) {
            return [...value];
        }
        return value;
    }, 2);

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
      if (!file) {
          return;
      }

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

              alert('Dados do calendário carregados com sucesso!');

          } catch (error) {
              console.error("Erro ao carregar o arquivo JSON:", error);
              alert("Erro ao carregar o arquivo. Verifique se é um arquivo JSON válido gerado por este aplicativo.");
          }
      };
      reader.readAsText(file);

      event.target.value = '';
  };

  const handleDownloadPdf = async () => {
    // 1. Validação inicial e preparação
    if (!dates.startDate || !dates.endDate) {
        alert("Por favor, defina a data de início e fim do semestre primeiro.");
        return;
    }
    setIsGeneratingPdf(true);
    const pdfDoc = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdfDoc.internal.pageSize.getWidth();
    const pdfHeight = pdfDoc.internal.pageSize.getHeight();
    const originalDate = currentDate;

    // Função auxiliar para desenhar a legenda em qualquer página
    const drawLegend = (pdf, startY) => {
        pdf.setFontSize(10).setFont(undefined, 'bold');
        pdf.text('Legenda:', 14, startY);
        let currentY = startY + 6;
        let currentX = 14;
        const itemWidth = 55;

        const addLegendItem = (colorClass, label) => {
            if (currentX + itemWidth > pdfWidth - 10) {
                currentX = 14;
                currentY += 7;
            }
            if (currentY > pdfHeight - 15) return; // Não desenha se não couber na página

            const tempDiv = document.createElement('div');
            tempDiv.className = colorClass;
            document.body.appendChild(tempDiv);
            const rgbColor = window.getComputedStyle(tempDiv).backgroundColor;
            document.body.removeChild(tempDiv);
            const [r, g, b] = rgbColor.match(/\d+/g).map(Number);

            pdf.setDrawColor(0);
            pdf.setFillColor(r, g, b);
            pdf.rect(currentX, currentY - 3, 4, 4, 'F');
            
            pdf.setFontSize(8).setFont(undefined, 'normal');
            pdf.text(label, currentX + 7, currentY);
            currentX += itemWidth;
        };
        
        addLegendItem(colors.class, 'Dia de Aula');
        dates.curricularUnits.forEach(unit => addLegendItem(unit.color, unit.name));
        addLegendItem(colors.holiday, 'Feriado');
        addLegendItem(colors.emenda, 'Emenda');
        addLegendItem(colors.makeup, 'Reposição');
        addLegendItem(colors.weekend, 'Sem Aula');
    };

    try {
        // 2. Loop para gerar cada mês
        const start = new Date(dates.startDate + 'T12:00:00');
        const end = new Date(dates.endDate + 'T12:00:00');
        let loopDate = new Date(start.getFullYear(), start.getMonth(), 1);

        while (loopDate <= end) {
            await new Promise(resolve => {
                setCurrentDate(new Date(loopDate));
                setTimeout(resolve, 150);
            });

            const calendarElement = calendarPdfRef.current;
            if (calendarElement) {
                const canvas = await html2canvas(calendarElement, {
                    scale: 2,
                    onclone: (documentClone) => {
                        // Encontra todos os elementos marcados com .pdf-hide no clone e os esconde
                        documentClone.querySelectorAll('.pdf-hide').forEach(el => {
                            el.style.visibility = 'hidden';
                        });
                    }
                });
                const imgData = canvas.toDataURL('image/png');
                const imgHeight = (canvas.height * (pdfWidth - 20)) / canvas.width;

                if (loopDate.getTime() !== new Date(start.getFullYear(), start.getMonth(), 1).getTime()) {
                    pdfDoc.addPage();
                }

                // --- AJUSTE: Adicionando o logo em todas as páginas ---
                pdfDoc.addImage(senaiLogo, 'PNG', pdfWidth - 35, 8, 25, 6.4);

                pdfDoc.setFontSize(16).setFont(undefined, 'bold');
                pdfDoc.text(turmaName || 'Calendário Escolar', 14, 15);
                
                const monthName = loopDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
                pdfDoc.setFontSize(12).setFont(undefined, 'normal');
                pdfDoc.text(monthName.charAt(0).toUpperCase() + monthName.slice(1), 14, 22);

                pdfDoc.addImage(imgData, 'PNG', 10, 30, pdfWidth - 20, imgHeight);

                // --- AJUSTE: Desenhando a legenda em todas as páginas ---
                drawLegend(pdfDoc, imgHeight + 40);
            }
            loopDate.setMonth(loopDate.getMonth() + 1);
        }

        // 3. --- AJUSTE: Adiciona a página final com a lista de datas ---
        pdfDoc.addPage();
        pdfDoc.addImage(senaiLogo, 'PNG', pdfWidth - 35, 8, 25, 6.4);
        pdfDoc.setFontSize(16).setFont(undefined, 'bold');
        pdfDoc.text('Datas Importantes', 14, 20);
        let currentY = 30;

        const renderListToPdf = (title, dateSet) => {
            if (dateSet.size > 0) {
                if (currentY > pdfHeight - 25) { pdfDoc.addPage(); currentY = 20; }
                pdfDoc.setFontSize(12).setFont(undefined, 'bold');
                pdfDoc.text(title, 14, currentY);
                currentY += 7;
                
                pdfDoc.setFontSize(10).setFont(undefined, 'normal');
                [...dateSet].sort().forEach(date => {
                    if (currentY > pdfHeight - 15) { pdfDoc.addPage(); currentY = 20; }
                    pdfDoc.text(`- ${new Date(date + 'T12:00:00').toLocaleDateString('pt-BR')}`, 18, currentY);
                    currentY += 6;
                });
                currentY += 4;
            }
        };
        if (dates.startDate) {
            renderListToPdf('Início do Curso:', new Set([dates.startDate]));
        }
        if (dates.endDate) {
            renderListToPdf('Término do Curso:', new Set([dates.endDate]));
        }
        renderListToPdf('Feriados:', dates.holidays);
        renderListToPdf('Emendas de Feriado:', dates.emendas);
        renderListToPdf('Reposição de Aulas:', dates.makeupDays);
        
        // 4. Salva o PDF
        pdfDoc.save(`${turmaName.replace(/ /g, '_') || 'calendario'}.pdf`);

    } catch (error) {
        console.error("Erro ao gerar o PDF:", error);
        alert("Ocorreu um erro ao gerar o PDF. Verifique o console para mais detalhes.");
    } finally {
        // 5. Restaura a data original e finaliza o processo
        setCurrentDate(originalDate);
        setIsGeneratingPdf(false);
    }
};

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });

  const renderDateList = (list, type, title) => (
    <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold text-gray-600 mb-2">{title}</h3>
        <ul className="space-y-1 max-h-32 overflow-y-auto">
            {[...list].sort().map(date => (
                <li key={date} className="flex justify-between items-center text-sm p-1 rounded bg-white shadow-sm">
                    <span>{new Date(date + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                    <button onClick={() => removeDateFromList(type, date)} className="text-red-500 hover:text-red-700 font-bold text-lg">&times;</button>
                </li>
            ))}
        </ul>
    </div>
  );

  return (
    <>
      <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8 font-sans" onClick={() => setColorPickerState({visible: false})}>
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-8"><h1 className="text-4xl font-extrabold text-gray-800">Calendário Escolar Interativo</h1></header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <CalendarControls turmaName={turmaName} onTurmaNameChange={(e) => setTurmaName(e.target.value)} onDatesChange={handleDateChange} onAddHoliday={addHolidayAndBridge} onAddMakeupDay={addMakeupDay} classWeekDays={classWeekDays} onClassWeekDaysChange={handleClassWeekDaysChange} />
              <CurricularUnitControls onAddUnit={handleAddUnit} onUpdateUnit={handleUpdateUnit} editingUnit={editingUnit} onCancelEdit={() => setEditingUnit(null)} generalWeekDays={classWeekDays} />
              {dates.curricularUnits.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-gray-600 mb-2">UCs Adicionadas</h3>
                    <ul className="space-y-2">
                        {dates.curricularUnits.map(unit => (
                            <li key={unit.id} className="flex justify-between items-center text-sm p-2 rounded bg-white shadow-sm">
                                <div className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded-full ${unit.color}`}></div>
                                    <span>{unit.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setEditingUnit(unit)} className="text-blue-500 hover:text-blue-700 font-bold text-xs">
                                      <FontAwesomeIcon icon={faEdit} /> Editar
                                    </button>
                                    <button onClick={() => handleRemoveUnit(unit.id)} className="text-red-500 hover:text-red-700 font-bold text-lg">
                                      <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
              )}
              {renderDateList(dates.holidays, 'holidays', 'Feriados Marcados')}
              {renderDateList(dates.makeupDays, 'makeupDays', 'Reposições Marcadas')}
            </div>

            <div className="lg:col-span-2">
              <div ref={calendarPdfRef}>
                <div className="flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow">
                  <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors pdf-hide">
                    <FontAwesomeIcon icon={faChevronLeft} className="mr-2" /> Anterior
                  </button>
                  <h2 className="text-2xl font-bold text-red-700 capitalize">{monthName} de {year}</h2>
                  <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors pdf-hide">
                    Próximo <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
                  </button>
                </div>
                <CalendarGrid month={month} year={year} dates={dates} colors={colors} individualDayColors={individualDayColors} classWeekDays={classWeekDays} onDayClick={handleOpenColorPicker} />
              </div>
               <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-3">Legenda (clique para alterar a cor)</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                    {/* Sua legenda... (não precisa mexer aqui) */}
                    <div onClick={(e) => handleOpenColorPicker(e, 'global', 'class')} className="flex items-center gap-2 cursor-pointer"><div className={`w-5 h-5 rounded shadow-inner ${colors.class}`}></div><span>Dia de Aula</span></div>
                    {dates.curricularUnits.map(unit => (
                        <div key={unit.id} onClick={(e) => handleOpenColorPicker(e, 'curricular', unit.id)} className="flex items-center gap-2 cursor-pointer">
                          <div className={`w-5 h-5 rounded shadow-inner ${unit.color}`}></div><span>{unit.name}</span>
                        </div>
                    ))}
                    <div onClick={(e) => handleOpenColorPicker(e, 'global', 'holiday')} className="flex items-center gap-2 cursor-pointer"><div className={`w-5 h-5 rounded shadow-inner ${colors.holiday}`}></div><span>Feriado</span></div>
                    <div onClick={(e) => handleOpenColorPicker(e, 'global', 'emenda')} className="flex items-center gap-2 cursor-pointer"><div className={`w-5 h-5 rounded shadow-inner ${colors.emenda}`}></div><span>Emenda</span></div>
                    <div onClick={(e) => handleOpenColorPicker(e, 'global', 'makeup')} className="flex items-center gap-2 cursor-pointer"><div className={`w-5 h-5 rounded shadow-inner ${colors.makeup}`}></div><span>Reposição</span></div>
                    <div onClick={(e) => handleOpenColorPicker(e, 'global', 'weekend')} className="flex items-center gap-2 cursor-pointer"><div className={`w-5 h-5 rounded shadow-inner ${colors.weekend}`}></div><span>Sem Aula</span></div>
                </div>
                <button onClick={handleRestoreColors} className="mt-4 w-full py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition-colors">
                  <FontAwesomeIcon icon={faUndo} className="mr-2" /> Restaurar Cores Padrão
                  </button>
                
                {/* --- INÍCIO DA PARTE NOVA QUE VOCÊ VAI ADICIONAR --- */}

                {/* Input de arquivo escondido, que será acionado pelo botão "Carregar" */}
                <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden"
                    accept=".json"
                    onChange={handleImportJson}
                />

                {/* Botões para Salvar e Carregar */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <button onClick={() => fileInputRef.current.click()} className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
                        <FontAwesomeIcon icon={faUpload} className="mr-2" /> Carregar (JSON)
                    </button>
                    <button onClick={handleExportJson} className="w-full py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors">
                        <FontAwesomeIcon icon={faDownload} className="mr-2" /> Salvar (JSON)
                    </button>
                </div>

                {/* --- FIM DA PARTE NOVA --- */}
                
                <button onClick={handleDownloadPdf} disabled={isGeneratingPdf} className="mt-2 w-full py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-colors disabled:bg-teal-300 disabled:cursor-not-allowed">
                    <FontAwesomeIcon icon={faFilePdf} className="mr-2" /> {isGeneratingPdf ? 'Gerando PDF...' : 'Baixar Calendário (PDF)'}
                </button>
            </div>
              </div>
          </div>
        </div>
        
        {colorPickerState.visible && <ColorPicker position={colorPickerState.position} onSelectColor={handleSelectColor} onClose={() => setColorPickerState({ visible: false })} />}
      </div>
    </>
  );
}