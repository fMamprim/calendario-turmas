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
  recess: 'bg-orange-200',
  vacation: 'bg-yellow-200',
  weekend: 'bg-gray-200',
};

// Funções de conversão HH:MM ↔ decimal
const hoursToTime = (hours) => {
  if (!hours || isNaN(hours)) return '04:00';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const timeToHours = (time) => {
  if (!time) return 4;
  const [h, m] = time.split(':').map(Number);
  return h + (m / 60);
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

const calculateEndDate = (startDate, totalHours, hoursPerDay, weekDays, holidays, emendas, makeupDays = new Set(), recesses = new Set(), vacations = new Set()) => {
  if (!startDate || !totalHours || totalHours <= 0 || !hoursPerDay || hoursPerDay <= 0 || !weekDays || weekDays.length === 0) {
    return null;
  }

  const daysNeeded = Math.ceil(totalHours / hoursPerDay);
  let currentDate = new Date(startDate + 'T12:00:00');
  let daysCount = 0;

  // Safety break to prevent infinite loops (e.g. if all days are holidays/weekends for a year)
  let loopSafety = 0;
  const MAX_LOOPS = 365 * 2;

  while (daysCount < daysNeeded && loopSafety < MAX_LOOPS) {
    loopSafety++;
    const dayOfWeek = currentDate.getDay();
    const dateStr = formatDateToISO(currentDate);

    // Condição: É dia de aula (dia da semana e não feriado/emenda/recesso) OU é dia de reposição
    const isClassDay = weekDays.includes(dayOfWeek) && !holidays.has(dateStr) && !emendas.has(dateStr) && !recesses.has(dateStr);
    const isMakeupDay = makeupDays.has(dateStr);

    if (isClassDay || isMakeupDay) {
      daysCount++;
    }

    if (daysCount < daysNeeded) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return formatDateToISO(currentDate);
};

const getEffectiveDays = (startDate, endDate, weekDays, holidays, emendas, makeupDays, recesses = new Set(), vacations = new Set()) => {
  if (!startDate || !endDate || !weekDays) return [];
  const start = new Date(startDate + 'T12:00:00');
  const end = new Date(endDate + 'T12:00:00');
  const days = [];
  let current = new Date(start);

  // Safety
  let loopCount = 0;
  const MAX_LOOPS = 365 * 5;

  while (current <= end && loopCount < MAX_LOOPS) {
    loopCount++;
    const dayOfWeek = current.getDay();
    const dateStr = formatDateToISO(current);

    const isClassDay = weekDays.includes(dayOfWeek) && !holidays.has(dateStr) && !emendas.has(dateStr) && !recesses.has(dateStr) && !vacations.has(dateStr);
    const isMakeupDay = makeupDays.has(dateStr);

    if (isClassDay || isMakeupDay) {
      days.push(dateStr);
    }
    current.setDate(current.getDate() + 1);
  }
  return days;
};

const generateDateRange = (start, end) => {
  const dates = [];
  const current = new Date(start + 'T12:00:00');
  const endDate = new Date(end + 'T12:00:00');

  while (current <= endDate) {
    dates.push(formatDateToISO(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const calculateMetrics = (totalDays, hoursPerDay) => {
  // Regra: Máximo 7.5h computáveis por dia (10 aulas de 45min)
  const effectiveHoursPerDay = Math.min(hoursPerDay, 7.5);

  const totalHours = totalDays * effectiveHoursPerDay;

  // Aulas de 45 min (0.75h)
  // Total Aulas = Total Horas / 0.75
  const totalClasses = totalHours / 0.75;

  return {
    days: totalDays,
    hours: parseFloat(totalHours.toFixed(1)),
    classes: Math.floor(totalClasses) // Aulas inteiras
  };
};

const ColorPicker = ({ position, onSelectColor, onClose }) => (
  <div className="fixed z-20 p-2 bg-white border rounded-lg shadow-xl" style={{ top: position.y, left: position.x }} onMouseLeave={onClose}>
    <div className="grid grid-cols-4 gap-2">
      {COLOR_PALETTE.map(colorClass => <div key={colorClass} className={`w-8 h-8 rounded-full cursor-pointer hover:scale-110 transition-transform ${colorClass}`} onClick={() => onSelectColor(colorClass)} />)}
    </div>
  </div>
);

const CalendarControls = ({ turmaName, onTurmaNameChange, onDatesChange, onAddHoliday, onAddMakeupDay, onAddRecess, onAddVacationPeriod, classWeekDays, onClassWeekDaysChange, courseHours, onCourseHoursChange, hoursPerDay, onHoursPerDayChange, autoCalculateEnd, onAutoCalculateEndChange, onFetchNationalHolidays, isFetchingHolidays, curricularUnits }) => {
  const [holidayInput, setHolidayInput] = useState('');
  const [holidayNameInput, setHolidayNameInput] = useState('');
  const [makeupInput, setMakeupInput] = useState('');
  const [makeupUnitId, setMakeupUnitId] = useState('');
  const [recessInput, setRecessInput] = useState('');
  const [recessNameInput, setRecessNameInput] = useState('');
  const [vacationStart, setVacationStart] = useState('');
  const [vacationEnd, setVacationEnd] = useState('');
  const [vacationName, setVacationName] = useState('');

  const handleAddDate = (type) => (e) => {
    e.preventDefault();
    if (type === 'holiday' && holidayInput) {
      onAddHoliday(holidayInput, holidayNameInput);
      setHolidayInput('');
      setHolidayNameInput('');
    }
    else if (type === 'makeup' && makeupInput) {
      onAddMakeupDay(makeupInput, makeupUnitId);
      setMakeupInput('');
      setMakeupUnitId('');
    } else if (type === 'recess' && recessInput) {
      onAddRecess(recessInput, recessNameInput);
      setRecessInput('');
      setRecessNameInput('');
    } else if (type === 'vacation' && vacationStart && vacationEnd) {
      onAddVacationPeriod({ start: vacationStart, end: vacationEnd, name: vacationName });
      setVacationStart('');
      setVacationEnd('');
      setVacationName('');
    }
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
          <input type="date" id="endDate" name="endDate" onChange={onDatesChange} disabled={autoCalculateEnd} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="courseHours" className="block text-sm font-medium text-gray-600 mb-1">Carga Horária Total</label>
            <input type="number" id="courseHours" name="courseHours" value={courseHours} onChange={onCourseHoursChange} placeholder="Ex: 800" min="0" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label htmlFor="hoursPerDay" className="block text-sm font-medium text-gray-600 mb-1">Horas de Aula por Dia</label>
            <input
              type="time"
              id="hoursPerDay"
              name="hoursPerDay"
              value={hoursToTime(hoursPerDay)}
              onChange={onHoursPerDayChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-300">
          <label htmlFor="autoCalculateEnd" className="text-sm font-medium text-gray-700 select-none">
            Calcular fim do curso automaticamente
          </label>
          <button
            type="button"
            onClick={onAutoCalculateEndChange}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${autoCalculateEnd ? 'bg-blue-600' : 'bg-gray-300'
              }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoCalculateEnd ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
          </button>
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
        <div className="flex flex-col gap-2">
          <input type="date" id="holiday" value={holidayInput} onChange={(e) => setHolidayInput(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500" />
          <input type="text" id="holidayName" value={holidayNameInput} onChange={(e) => setHolidayNameInput(e.target.value)} placeholder="Nome do feriado (opcional)" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500" />
          <div className="flex gap-2">
            <button type="submit" className="flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors">
              <FontAwesomeIcon icon={faPlus} className="mr-2" />Adicionar
            </button>
            <button type="button" onClick={onFetchNationalHolidays} disabled={isFetchingHolidays} className="flex-1 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300">
              {isFetchingHolidays ? 'Carregando...' : 'Feriados Nacionais'}
            </button>
          </div>
        </div>
      </form>
      <form onSubmit={handleAddDate('makeup')} className="space-y-2">
        <label htmlFor="makeup" className="block text-sm font-medium text-gray-600">Adicionar Dia de Reposição</label>
        <div className="flex flex-col gap-2">
          <input type="date" id="makeup" value={makeupInput} onChange={(e) => setMakeupInput(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500" />
          <select
            id="makeupUnit"
            value={makeupUnitId}
            onChange={(e) => setMakeupUnitId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          >
            <option value="">Selecione a UC que será reposta (Opcional)</option>
            {curricularUnits && curricularUnits.map(unit => (
              <option key={unit.id} value={unit.id}>{unit.name}</option>
            ))}
          </select>
          <button type="submit" className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />Adicionar
          </button>
        </div>
      </form>

      <div className="border-t border-gray-200 my-4 pt-4"></div>

      <form onSubmit={handleAddDate('recess')} className="space-y-2">
        <label htmlFor="recess" className="block text-sm font-medium text-gray-600">Adicionar Recesso (Dia Único)</label>
        <div className="flex flex-col gap-2">
          <input type="date" id="recess" value={recessInput} onChange={(e) => setRecessInput(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500" />
          <input type="text" id="recessName" value={recessNameInput} onChange={(e) => setRecessNameInput(e.target.value)} placeholder="Motivo (ex: Conselho)" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500" />
          <button type="submit" className="w-full px-4 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-colors">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />Adicionar Recesso
          </button>
        </div>
      </form>

      <div className="border-t border-gray-200 my-4 pt-4"></div>

      <form onSubmit={handleAddDate('vacation')} className="space-y-2">
        <label className="block text-sm font-medium text-gray-600">Adicionar Férias / Licença (Período)</label>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Início</label>
              <input type="date" value={vacationStart} onChange={(e) => setVacationStart(e.target.value)} className="w-full p-2 border border-blue-100 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white" />
            </div>
            <div>
              <label className="text-xs text-gray-500">Fim</label>
              <input type="date" value={vacationEnd} onChange={(e) => setVacationEnd(e.target.value)} className="w-full p-2 border border-blue-100 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white" />
            </div>
          </div>
          <input type="text" value={vacationName} onChange={(e) => setVacationName(e.target.value)} placeholder="Nome (ex: Férias de Julho)" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500" />
          <button type="submit" className="w-full px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition-colors">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />Adicionar Período
          </button>
        </div>
      </form>
    </div>
  );
};

const CurricularUnitControls = ({ onAddUnit, onUpdateUnit, editingUnit, onCancelEdit, generalWeekDays, holidays, emendas, makeupDays, hoursPerDay, recesses, vacations }) => {
  const initialFormState = { name: '', startDate: '', endDate: '', weekDays: [], hours: '', dailyHours: '', autoCalculate: false };
  const [unit, setUnit] = useState(initialFormState);
  const isEditing = !!editingUnit;

  useEffect(() => {
    if (isEditing) {
      setUnit(editingUnit); // Assuming editingUnit now has hours and autoCalculate
    } else {
      setUnit(initialFormState);
    }
  }, [editingUnit]);

  useEffect(() => {
    if (unit.autoCalculate && unit.startDate && unit.hours && unit.hours > 0 && unit.weekDays.length > 0) {
      const effectiveHoursPerDay = unit.dailyHours && Number(unit.dailyHours) > 0 ? Number(unit.dailyHours) : hoursPerDay;
      const newEndDate = calculateEndDate(unit.startDate, unit.hours, effectiveHoursPerDay, unit.weekDays, holidays, emendas, makeupDays, recesses, vacations);
      if (newEndDate && newEndDate !== unit.endDate) {
        setUnit(prev => ({ ...prev, endDate: newEndDate }));
      }
    }
  }, [unit.autoCalculate, unit.startDate, unit.hours, unit.weekDays, unit.dailyHours, hoursPerDay, holidays, emendas, makeupDays, recesses, vacations]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUnit(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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

        <div className="grid grid-cols-2 gap-4 bg-gray-100 p-3 rounded-md border border-gray-200">
          <div className="col-span-2 flex items-center justify-between mb-2">
            <label htmlFor="ucAutoCalc" className="text-sm font-medium text-gray-700 select-none cursor-pointer flex-1">
              Calcular fim automaticamente
            </label>
            <button
              type="button"
              onClick={() => setUnit(prev => ({ ...prev, autoCalculate: !prev.autoCalculate }))}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${unit.autoCalculate ? 'bg-teal-600' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${unit.autoCalculate ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>

          {unit.autoCalculate && (
            <div className="col-span-2 grid grid-cols-2 gap-2 mb-2">
              <div>
                <label htmlFor="ucHours" className="block text-xs font-medium text-gray-500 mb-1">Carga Horária (h)</label>
                <input type="number" name="hours" value={unit.hours} onChange={handleInputChange} placeholder="Ex: 40" className="w-full p-2 border border-gray-300 rounded-md text-sm" />
              </div>
              <div>
                <label htmlFor="ucDailyHours" className="block text-xs font-medium text-gray-500 mb-1">Horas/Dia (Opcional)</label>
                <input
                  type="time"
                  name="dailyHours"
                  value={unit.dailyHours ? hoursToTime(unit.dailyHours) : ''}
                  onChange={(e) => {
                    const hours = e.target.value ? timeToHours(e.target.value) : '';
                    handleInputChange({ target: { name: 'dailyHours', value: hours } });
                  }}
                  placeholder={`Padrão: ${hoursToTime(hoursPerDay)}`}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-600 mb-1">Início</label>
            <input type="date" name="startDate" value={unit.startDate} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-600 mb-1">Fim</label>
            <input type="date" name="endDate" value={unit.endDate} onChange={handleInputChange} disabled={unit.autoCalculate} className="w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-200 disabled:cursor-not-allowed" />
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

const CalendarGrid = ({ month, year, dates, colors, individualDayColors, classWeekDays, onDayClick, holidayNames, makeupNames, recessNames, vacationDays = new Set(), vacationNames = new Map() }) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const getDayStyle = useCallback((day) => {
    const dateStr = formatDateToISO(new Date(year, month, day));
    const dayOfWeek = new Date(year, month, day).getDay();

    if (individualDayColors[dateStr]) {
      return { type: 'individual', className: individualDayColors[dateStr] };
    }
    if (dates.holidays.has(dateStr)) return { type: 'holiday', className: colors.holiday };
    if (dates.recesses.has(dateStr)) return { type: 'recess', className: colors.recess };
    if (vacationDays.has(dateStr)) return { type: 'vacation', className: colors.vacation };
    if (dates.emendas.has(dateStr)) return { type: 'emenda', className: colors.emenda };
    if (dates.makeupDays.has(dateStr)) return { type: 'makeup', className: colors.makeup };

    // UCs Automáticas (Prioridade sobre genérico)
    const activeUCs = dates.curricularUnits.filter(uc =>
      uc.startDate && uc.endDate &&
      dateStr >= uc.startDate && dateStr <= uc.endDate &&
      uc.weekDays.includes(dayOfWeek)
    );
    if (activeUCs.length > 0) {
      const ucColors = activeUCs.map(uc => uc.color);
      return { type: 'curricular', className: ucColors.length === 1 ? ucColors[0] : ucColors };
    }

    // Dia de Aula Genérico (Respeitando limites do curso)
    const inCourseRange = dates.startDate && dateStr >= dates.startDate && (!dates.endDate || dateStr <= dates.endDate);
    if (inCourseRange && classWeekDays.includes(dayOfWeek)) {
      return { type: 'class', className: colors.class };
    }

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { type: 'weekend', className: `${colors.weekend} text-gray-500` };
    }
    return { type: 'default', className: 'bg-white text-gray-700' };
  }, [year, month, dates, colors, individualDayColors, classWeekDays, vacationDays]);


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
          const dateStr = formatDateToISO(new Date(year, month, day));

          // Criar tooltip com nome do feriado/reposição
          let title = '';
          if (dates.holidays.has(dateStr) && holidayNames.has(dateStr)) {
            title = `Feriado: ${holidayNames.get(dateStr)}`;
          } else if (dates.makeupDays.has(dateStr)) {
            const ucId = makeupNames.get(dateStr);
            const uc = dates.curricularUnits.find(u => String(u.id) === String(ucId));
            const ucName = uc ? uc.name : (ucId || 'Reposição');
            title = `Reposição: ${ucName}`;
          } else if (dates.recesses.has(dateStr)) {
            title = `Recesso: ${recessNames.get(dateStr) || 'Recesso'}`;
          } else if (vacationDays.has(dateStr)) {
            title = `${vacationNames.get(dateStr) || 'Férias / Licença'}`;
          }

          const styles = getDayStyle(day);
          const classes = Array.isArray(styles.className) ? styles.className : [styles.className];
          const isMulti = classes.length > 1;

          return (
            <div
              key={day}
              onClick={(e) => onDayClick(e, 'individual', dateStr)}
              title={title}
              className={`relative h-16 md:h-20 border rounded-md transition-all duration-200 cursor-pointer hover:shadow-md ${!isMulti ? classes[0] : 'bg-gray-50'} ${isToday ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
            >
              {isMulti && (
                <div className="absolute inset-0 w-full h-full grid grid-cols-2 grid-rows-2 rounded-md overflow-hidden">
                  {classes.map((c, i) => (
                    <div
                      key={i}
                      className={`${c} ${classes.length === 2 ? 'row-span-2' : ''} ${classes.length === 3 && i === 0 ? 'col-span-2' : ''}`}
                    />
                  ))}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-lg font-medium relative z-10">{dayIndex + 1}</span>
              </div>
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
    makeupDays: new Set(), emendas: new Set(), curricularUnits: [], recesses: new Set(),
  });
  const [vacationPeriods, setVacationPeriods] = useState([]);
  const [holidayNames, setHolidayNames] = useState(new Map());
  const [makeupNames, setMakeupNames] = useState(new Map());
  const [recessNames, setRecessNames] = useState(new Map());


  const [showPdfModal, setShowPdfModal] = useState(false); // Novo estado
  const [pdfMode, setPdfMode] = useState('full'); // 'full' ou 'compact'
  const [isFetchingHolidays, setIsFetchingHolidays] = useState(false);
  const [colors, setColors] = useState(DEFAULT_COLORS);
  const [individualDayColors, setIndividualDayColors] = useState({});
  const [classWeekDays, setClassWeekDays] = useState([1, 2, 3, 4, 5]);
  const [colorPickerState, setColorPickerState] = useState({ visible: false, position: null, target: null });
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [courseHours, setCourseHours] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [autoCalculateEnd, setAutoCalculateEnd] = useState(false);
  const calendarPdfRef = useRef(null);

  const handleDateChange = (e) => {
    setDates(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const vacationDays = useMemo(() => {
    const days = new Set();
    vacationPeriods.forEach(period => {
      if (period.start && period.end) {
        const range = generateDateRange(period.start, period.end);
        range.forEach(d => days.add(d));
      }
    });
    return days;
  }, [vacationPeriods]);

  const vacationNames = useMemo(() => {
    const names = new Map();
    vacationPeriods.forEach(period => {
      if (period.start && period.end) {
        const range = generateDateRange(period.start, period.end);
        range.forEach(d => names.set(d, period.name || 'Férias/Licença'));
      }
    });
    return names;
  }, [vacationPeriods]);

  // useEffect para recalcular quando necessário
  useEffect(() => {
    if (autoCalculateEnd && dates.startDate && courseHours && courseHours > 0 && hoursPerDay > 0) {
      const newEndDate = calculateEndDate(dates.startDate, courseHours, hoursPerDay, classWeekDays, dates.holidays, dates.emendas, dates.makeupDays, dates.recesses, vacationDays);

      // Só atualiza se a data calculada for diferente da atual
      if (newEndDate && newEndDate !== dates.endDate) {
        setDates(prev => ({ ...prev, endDate: newEndDate }));
      }
    }
  }, [autoCalculateEnd, dates.startDate, courseHours, hoursPerDay, classWeekDays, dates.holidays, dates.emendas, dates.makeupDays, dates.recesses, vacationDays]);

  const courseMetrics = useMemo(() => {
    if (!dates.startDate || !dates.endDate) return null;
    const days = getEffectiveDays(dates.startDate, dates.endDate, classWeekDays, dates.holidays, dates.emendas, dates.makeupDays, dates.recesses, vacationDays);
    return calculateMetrics(days.length, hoursPerDay);
  }, [dates.startDate, dates.endDate, classWeekDays, dates.holidays, dates.emendas, dates.makeupDays, dates.recesses, vacationDays, hoursPerDay]);

  const ucMetrics = useMemo(() => {
    return dates.curricularUnits.map(uc => {
      if (!uc.startDate || !uc.endDate) return { ...uc, metrics: null };
      const ucHoursPerDay = uc.dailyHours && Number(uc.dailyHours) > 0 ? Number(uc.dailyHours) : hoursPerDay;
      const days = getEffectiveDays(uc.startDate, uc.endDate, uc.weekDays, dates.holidays, dates.emendas, dates.makeupDays, dates.recesses, vacationDays);
      return { ...uc, metrics: calculateMetrics(days.length, ucHoursPerDay) };
    });
  }, [dates.curricularUnits, dates.holidays, dates.emendas, dates.makeupDays, dates.recesses, vacationDays, hoursPerDay]);

  const handleCourseHoursChange = (e) => {
    setCourseHours(e.target.value);
  };

  const handleHoursPerDayChange = (e) => {
    const hours = timeToHours(e.target.value);
    if (hours > 8) {
      setHoursPerDay(8);
    } else if (hours < 0) {
      setHoursPerDay(0);
    } else {
      setHoursPerDay(hours);
    }
  };

  const handleAutoCalculateEndChange = () => {
    setAutoCalculateEnd(prev => !prev);
  };

  const addHolidayAndBridge = (dateStr, name = '') => {
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
    if (name) {
      setHolidayNames(prev => new Map(prev).set(isoDate, name));
    }
  };

  const fetchNationalHolidays = async () => {
    setIsFetchingHolidays(true);
    try {
      const year = dates.startDate ? new Date(dates.startDate).getFullYear() : new Date().getFullYear();
      const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`);
      if (!response.ok) throw new Error('Erro ao buscar feriados');
      const holidays = await response.json();

      holidays.forEach(holiday => {
        const isoDate = formatDateToISO(holiday.date);
        addHolidayAndBridge(isoDate, holiday.name);
      });

      alert(`${holidays.length} feriados nacionais de ${year} foram adicionados!`);
    } catch (error) {
      console.error('Erro ao buscar feriados:', error);
      alert('Não foi possível carregar os feriados nacionais. Verifique sua conexão com a internet.');
    } finally {
      setIsFetchingHolidays(false);
    }
  };

  const addMakeupDay = (dateStr, unitId = '') => {
    if (!dateStr) return;
    const isoDate = formatDateToISO(dateStr);
    setDates(prev => ({ ...prev, makeupDays: new Set(prev.makeupDays).add(isoDate) }));
    if (unitId) {
      setMakeupNames(prev => new Map(prev).set(isoDate, unitId));
    }
  };

  const addRecess = (dateStr, name = '') => {
    if (!dateStr) return;
    const isoDate = formatDateToISO(dateStr);
    setDates(prev => ({ ...prev, recesses: new Set(prev.recesses).add(isoDate) }));
    if (name) {
      setRecessNames(prev => new Map(prev).set(isoDate, name));
    }
  };

  const addVacationPeriod = (period) => {
    setVacationPeriods(prev => [...prev, { ...period, id: Date.now() }]);
  };

  const removeVacationPeriod = (id) => {
    setVacationPeriods(prev => prev.filter(p => p.id !== id));
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
      setHolidayNames(prev => {
        const newMap = new Map(prev);
        newMap.delete(date);
        return newMap;
      });
    } else if (listType === 'makeupDays') {
      setDates(prev => {
        const newSet = new Set(prev[listType]); newSet.delete(date);
        return { ...prev, [listType]: newSet };
      });
      setMakeupNames(prev => {
        const newMap = new Map(prev);
        newMap.delete(date);
        return newMap;
      });
    } else if (listType === 'recesses') {
      setDates(prev => {
        const newSet = new Set(prev[listType]); newSet.delete(date);
        return { ...prev, [listType]: newSet };
      });
      setRecessNames(prev => {
        const newMap = new Map(prev);
        newMap.delete(date);
        return newMap;
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
      setIndividualDayColors(prev => {
        const current = prev[identifier];
        let newColors = [];

        if (Array.isArray(current)) newColors = [...current];
        else if (current) newColors = [current];

        if (newColors.includes(colorClass)) {
          // Remove (Toggle)
          newColors = newColors.filter(c => c !== colorClass);
        } else {
          // Add (Limit 4)
          if (newColors.length < 4) newColors.push(colorClass);
          else alert("Máximo de 4 matérias por dia.");
        }

        const copy = { ...prev };
        if (newColors.length === 0) {
          delete copy[identifier];
        } else {
          copy[identifier] = newColors.length === 1 ? newColors[0] : newColors;
        }
        return copy;
      });
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
      courseHours,
      hoursPerDay,
      autoCalculateEnd,
      holidayNames: [...holidayNames.entries()],
      makeupNames: [...makeupNames.entries()],
      recessNames: [...recessNames.entries()],
      vacationPeriods,
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
        setCourseHours(loadedData.courseHours || '');
        setHoursPerDay(loadedData.hoursPerDay || 4);
        setAutoCalculateEnd(loadedData.autoCalculateEnd || false);

        // Carregar Maps de nomes
        if (loadedData.holidayNames) {
          setHolidayNames(new Map(loadedData.holidayNames));
        }
        if (loadedData.makeupNames) {
          setMakeupNames(new Map(loadedData.makeupNames));
        }
        if (loadedData.recessNames) {
          setRecessNames(new Map(loadedData.recessNames));
        }

        if (loadedData.dates) {
          setDates({
            startDate: loadedData.dates.startDate,
            endDate: loadedData.dates.endDate,
            holidays: new Set(loadedData.dates.holidays || []),
            makeupDays: new Set(loadedData.dates.makeupDays || []),
            emendas: new Set(loadedData.dates.emendas || []),
            curricularUnits: loadedData.dates.curricularUnits || [],
            recesses: new Set(loadedData.dates.recesses || []),
          });
        }

        if (loadedData.vacationPeriods) {
          setVacationPeriods(loadedData.vacationPeriods);
        }

        alert('Dados do calendário carregados com sucesso!');
      } catch (error) {
        console.error("Erro ao carregar o arquivo JSON:", error);
        alert("Erro ao carregar o arquivo. Verifique se é um arquivo JSON válido gerado por este aplicativo.");
      }
    };
    reader.readAsText(file);
  };



  const handleDownloadClick = () => {
    setShowPdfModal(true);
  };

  const handleConfirmPdfGeneration = () => {
    setShowPdfModal(false);
    if (pdfMode === 'full') {
      generateFullPdf();
    } else {
      generateCompactPdf();
    }
  };

  const generateCompactPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const year = currentDate.getFullYear();

      const TAILWIND_COLORS = {
        'bg-blue-200': '#bfdbfe', 'bg-blue-500': '#3b82f6',
        'bg-red-300': '#fca5a5', 'bg-red-500': '#ef4444',
        'bg-green-300': '#86efac', 'bg-green-500': '#22c55e',
        'bg-purple-200': '#e9d5ff', 'bg-purple-500': '#a855f7',
        'bg-orange-200': '#fed7aa', 'bg-orange-500': '#f97316',
        'bg-yellow-200': '#fef08a', 'bg-yellow-500': '#eab308',
        'bg-gray-200': '#e5e7eb', 'bg-gray-500': '#6b7280',
        'bg-teal-600': '#0d9488',
        'bg-indigo-200': '#c7d2fe', 'bg-pink-200': '#fbcfe8',
        'bg-white': '#ffffff'
      };

      const getHex = (className) => {
        if (!className) return '#ffffff';
        const bgMatch = className.match(/bg-[a-z]+-[0-9]+/);
        if (bgMatch) return TAILWIND_COLORS[bgMatch[0]] || '#ffffff';
        return '#ffffff';
      };

      // Logo SENAI
      doc.addImage(senaiLogo, 'PNG', 10, 8, 25, 6.4);

      // Nome da Turma (se houver)
      if (turmaName) {
        doc.setFontSize(14);
        doc.setTextColor(40);
        doc.text(turmaName, 148.5, 10, { align: 'center' });
      }

      // Título
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.text(`Calendário Escolar ${year}`, 148.5, turmaName ? 18 : 12, { align: 'center' });

      // Métricas do Curso
      if (courseMetrics) {
        doc.setFontSize(10);
        doc.setTextColor(60);
        const metricsY = turmaName ? 24 : 18;
        doc.text(`${courseMetrics.days} dias • ${courseMetrics.hours}h • ${courseMetrics.classes} aulas`, 148.5, metricsY, { align: 'center' });
      }

      // Legenda
      doc.setFontSize(8);
      let legendX = 20;
      const legendY = turmaName ? 32 : 26;
      const legendItems = [
        { label: 'Aula', color: colors.class },
        { label: 'Feriado', color: colors.holiday },
        { label: 'Recesso', color: colors.recess },
        { label: 'Férias', color: colors.vacation },
        { label: 'Reposição', color: colors.makeup },
        { label: 'Emenda', color: colors.emenda }
      ];
      legendItems.forEach(item => {
        doc.setFillColor(getHex(item.color));
        doc.rect(legendX, legendY, 4, 4, 'F');
        doc.text(item.label, legendX + 5, legendY + 3);
        legendX += 25;
      });

      // Grid
      const startX = 10;
      const startY = turmaName ? 40 : 34;
      const colWidth = 68;
      const rowHeight = 55;
      const cols = 4;
      const cellW = 8;
      const cellH = 6;

      for (let m = 0; m < 12; m++) {
        const col = m % cols;
        const row = Math.floor(m / cols);
        const curX = startX + (col * colWidth);
        const curY = startY + (row * rowHeight);

        const mDate = new Date(year, m, 1);
        const mName = mDate.toLocaleString('pt-BR', { month: 'long' });
        doc.setFontSize(11);
        doc.setTextColor(0);
        doc.text(mName.charAt(0).toUpperCase() + mName.slice(1), curX + (colWidth / 2), curY - 2, { align: 'center' });

        doc.setFontSize(7);
        doc.setTextColor(100);
        ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].forEach((d, i) => {
          doc.text(d, curX + 2 + (i * cellW), curY + 2);
        });

        const firstDay = new Date(year, m, 1).getDay();
        const daysInMonth = new Date(year, m + 1, 0).getDate();

        let d = 1;
        for (let w = 0; w < 6; w++) {
          for (let wd = 0; wd < 7; wd++) {
            if (w === 0 && wd < firstDay) continue;
            if (d > daysInMonth) break;

            const dateStr = formatDateToISO(new Date(year, m, d));
            const dayOfWeek = wd;

            let colorsToDraw = [];

            if (individualDayColors[dateStr]) {
              const c = individualDayColors[dateStr];
              if (Array.isArray(c)) colorsToDraw = c.map(cl => getHex(cl));
              else colorsToDraw = [getHex(c)];
            } else {
              let singleHex = '#ffffff';
              if (dates.holidays.has(dateStr)) singleHex = getHex(colors.holiday);
              else if (dates.recesses.has(dateStr)) singleHex = getHex(colors.recess);
              else if (vacationDays.has(dateStr)) singleHex = getHex(colors.vacation);
              else if (dates.emendas.has(dateStr)) singleHex = getHex(colors.emenda);
              else if (dates.makeupDays.has(dateStr)) singleHex = getHex(colors.makeup);
              else if (classWeekDays.includes(dayOfWeek)) singleHex = getHex(colors.class);
              else if (dayOfWeek === 0 || dayOfWeek === 6) singleHex = getHex(colors.weekend);
              colorsToDraw = [singleHex];
            }

            const cellX = curX + (wd * cellW);
            const cellY = curY + 3 + (w * cellH);

            if (colorsToDraw.length === 1) {
              doc.setFillColor(colorsToDraw[0]);
              doc.rect(cellX, cellY, cellW, cellH, 'F');
            } else if (colorsToDraw.length === 2) {
              doc.setFillColor(colorsToDraw[0]);
              doc.rect(cellX, cellY, cellW / 2, cellH, 'F');
              doc.setFillColor(colorsToDraw[1]);
              doc.rect(cellX + cellW / 2, cellY, cellW / 2, cellH, 'F');
            } else if (colorsToDraw.length === 3) {
              doc.setFillColor(colorsToDraw[0]);
              doc.rect(cellX, cellY, cellW, cellH / 2, 'F');
              doc.setFillColor(colorsToDraw[1]);
              doc.rect(cellX, cellY + cellH / 2, cellW / 2, cellH / 2, 'F');
              doc.setFillColor(colorsToDraw[2]);
              doc.rect(cellX + cellW / 2, cellY + cellH / 2, cellW / 2, cellH / 2, 'F');
            } else if (colorsToDraw.length >= 4) {
              const c = colorsToDraw;
              doc.setFillColor(c[0]); doc.rect(cellX, cellY, cellW / 2, cellH / 2, 'F');
              doc.setFillColor(c[1]); doc.rect(cellX + cellW / 2, cellY, cellW / 2, cellH / 2, 'F');
              doc.setFillColor(c[2]); doc.rect(cellX, cellY + cellH / 2, cellW / 2, cellH / 2, 'F');
              doc.setFillColor(c[3]); doc.rect(cellX + cellW / 2, cellY + cellH / 2, cellW / 2, cellH / 2, 'F');
            }

            // Borda fina ao redor do dia
            doc.setDrawColor(200);
            doc.setLineWidth(0.1);
            doc.rect(cellX, cellY, cellW, cellH);

            doc.setTextColor(0);
            doc.setFontSize(7);
            doc.text(String(d), cellX + cellW / 2, cellY + cellH - 1.5, { align: 'center' });

            d++;
          }
          if (d > daysInMonth) break;
        }
      }

      doc.save(`Calendario_Compacto_${year}.pdf`);

    } catch (error) {
      console.error("Erro PDF Compacto:", error);
      alert("Erro ao gerar PDF Compacto.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const generateFullPdf = async () => {
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

      // --- Resumo do Curso ---
      pdfDoc.setFontSize(16).setFont(undefined, 'bold');
      pdfDoc.text('Resumo do Curso', 14, 20);

      pdfDoc.setFontSize(12).setFont(undefined, 'normal');
      let summaryY = 30;
      if (courseMetrics) {
        pdfDoc.text(`Dias Letivos: ${courseMetrics.days}`, 14, summaryY);
        pdfDoc.text(`Carga Horária Total: ${courseMetrics.hours}h`, 80, summaryY);
        pdfDoc.text(`Total de Aulas: ${courseMetrics.classes}`, 150, summaryY);
        summaryY += 10;
      }

      // Line separator
      pdfDoc.setDrawColor(200);
      pdfDoc.line(14, summaryY, pdfWidth - 14, summaryY);
      summaryY += 10;

      // --- Datas Importantes ---
      pdfDoc.setFontSize(16).setFont(undefined, 'bold');
      pdfDoc.text('Datas Importantes', 14, summaryY);
      let currentY = summaryY + 10;

      const renderListToPdf = (title, dateSet, namesMap = null) => {
        if (dateSet.size > 0) {
          if (currentY > pdfHeight - 25) { pdfDoc.addPage(); currentY = 20; }
          pdfDoc.setFontSize(12).setFont(undefined, 'bold');
          pdfDoc.text(title, 14, currentY);
          currentY += 7;

          pdfDoc.setFontSize(10).setFont(undefined, 'normal');
          pdfDoc.setFontSize(10).setFont(undefined, 'normal');
          [...dateSet].sort().forEach(date => {
            if (currentY > pdfHeight - 15) { pdfDoc.addPage(); currentY = 20; }
            const dateText = new Date(date + 'T12:00:00').toLocaleDateString('pt-BR');

            let name = '';
            // Se for reposição, tenta buscar o nome da UC
            if (namesMap && namesMap.has(date)) {
              const val = namesMap.get(date);
              // Verifica se é um ID de UC
              const uc = dates.curricularUnits.find(u => String(u.id) === String(val));
              name = uc ? ` - ${uc.name}` : ` - ${val}`;
            }

            pdfDoc.text(`- ${dateText}${name}`, 18, currentY);
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
      renderListToPdf('Feriados:', dates.holidays, holidayNames);
      renderListToPdf('Emendas de Feriado:', dates.emendas);
      renderListToPdf('Reposição de Aulas:', dates.makeupDays, makeupNames);

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

  const renderDateList = (list, type, title, namesMap = null) => (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-bold text-gray-600 mb-2">{title}</h3>
      <ul className="space-y-1 max-h-32 overflow-y-auto">
        {[...list].sort().map(date => {
          let name = '';
          if (namesMap && namesMap.has(date)) {
            const val = namesMap.get(date);
            const uc = dates.curricularUnits.find(u => String(u.id) === String(val));
            name = uc ? uc.name : val;
          }

          return (
            <li key={date} className="flex justify-between items-center text-sm p-1 rounded bg-white shadow-sm">
              <span className="flex-1">
                {new Date(date + 'T12:00:00').toLocaleDateString('pt-BR')}
                {name && <span className="text-gray-500 ml-2">- {name}</span>}
              </span>
              <button onClick={() => removeDateFromList(type, date)} className="text-red-500 hover:text-red-700 font-bold text-lg">&times;</button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <>
      <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8 font-sans" onClick={() => setColorPickerState({ visible: false })}>
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
              <div className="flex justify-center lg:justify-start">
                <img src={senaiLogo} alt="Logo SENAI" className="h-10 w-auto" />
              </div>
              <div className="lg:col-span-2 flex justify-center">
                <h1 className="text-4xl font-extrabold text-gray-800">Calendário Escolar Interativo</h1>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <CalendarControls
                turmaName={turmaName}
                onTurmaNameChange={(e) => setTurmaName(e.target.value)}
                onDatesChange={handleDateChange}
                onAddHoliday={addHolidayAndBridge}
                onAddMakeupDay={addMakeupDay}
                onAddRecess={addRecess}
                classWeekDays={classWeekDays}
                onClassWeekDaysChange={handleClassWeekDaysChange}
                courseHours={courseHours}
                onCourseHoursChange={handleCourseHoursChange}
                hoursPerDay={hoursPerDay}
                onHoursPerDayChange={handleHoursPerDayChange}
                autoCalculateEnd={autoCalculateEnd}
                onAutoCalculateEndChange={handleAutoCalculateEndChange}
                onFetchNationalHolidays={fetchNationalHolidays}
                isFetchingHolidays={isFetchingHolidays}
                curricularUnits={dates.curricularUnits}
              />
              <CurricularUnitControls
                onAddUnit={handleAddUnit}
                onUpdateUnit={handleUpdateUnit}
                editingUnit={editingUnit}
                onCancelEdit={() => setEditingUnit(null)}
                generalWeekDays={classWeekDays}
                holidays={dates.holidays}
                emendas={dates.emendas}
                makeupDays={dates.makeupDays}
                hoursPerDay={hoursPerDay}
                recesses={dates.recesses}
                vacations={vacationDays}
              />
              {dates.curricularUnits.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-gray-600 mb-2">Unidades Curriculares</h3>
                  <ul className="space-y-2">
                    {ucMetrics.map(unit => (
                      <li key={unit.id} className="p-2 rounded bg-white shadow-sm">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 flex-1">
                            <div className={`w-4 h-4 rounded ${unit.color}`}></div>
                            <span className="font-medium text-sm">{unit.name}</span>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setEditingUnit(unit)} className="text-blue-500 hover:text-blue-700">
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button onClick={() => handleRemoveUnit(unit.id)} className="text-red-500 hover:text-red-700">
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </div>
                        </div>
                        {unit.metrics && (
                          <div className="text-xs text-gray-500 mt-1 ml-6 flex gap-3">
                            <span>{unit.metrics.days} dias</span>
                            <span>{unit.metrics.hours}h</span>
                            <span>{unit.metrics.classes} aulas</span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {vacationPeriods.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-gray-600 mb-2">Férias e Licenças</h3>
                  <ul className="space-y-2">
                    {vacationPeriods.map(period => (
                      <li key={period.id} className="flex justify-between items-center text-sm p-2 rounded bg-white shadow-sm border-l-4 border-yellow-400">
                        <div>
                          <span className="font-bold block">{period.name}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(period.start + 'T12:00:00').toLocaleDateString('pt-BR')} até {new Date(period.end + 'T12:00:00').toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <button onClick={() => removeVacationPeriod(period.id)} className="text-red-500 hover:text-red-700 font-bold text-lg">
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {renderDateList(dates.holidays, 'holidays', 'Feriados Marcados', holidayNames)}
              {renderDateList(dates.recesses, 'recesses', 'Recessos Marcados', recessNames)}
              {renderDateList(dates.makeupDays, 'makeupDays', 'Reposições Marcadas', makeupNames)}
            </div>

            <div className="lg:col-span-2">
              <div ref={calendarPdfRef}>
                <div className="flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow">
                  <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors pdf-hide">
                    <FontAwesomeIcon icon={faChevronLeft} className="mr-2" /> Anterior
                  </button>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-700 capitalize">{monthName} de {year}</h2>
                    {courseMetrics && (
                      <div className="text-xs text-gray-600 mt-1 flex justify-center gap-4">
                        <span><strong>{courseMetrics.days}</strong> dias</span>
                        <span><strong>{courseMetrics.hours}h</strong> totais</span>
                        <span><strong>{courseMetrics.classes}</strong> aulas</span>
                      </div>
                    )}
                  </div>
                  <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors pdf-hide">
                    Próximo <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
                  </button>
                </div>
                <CalendarGrid month={month} year={year} dates={dates} colors={colors} individualDayColors={individualDayColors} classWeekDays={classWeekDays} onDayClick={handleOpenColorPicker} holidayNames={holidayNames} makeupNames={makeupNames} recessNames={recessNames} vacationDays={vacationDays} vacationNames={vacationNames} />
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
                  <div onClick={(e) => handleOpenColorPicker(e, 'global', 'recess')} className="flex items-center gap-2 cursor-pointer"><div className={`w-5 h-5 rounded shadow-inner ${colors.recess}`}></div><span>Recesso</span></div>
                  <div onClick={(e) => handleOpenColorPicker(e, 'global', 'vacation')} className="flex items-center gap-2 cursor-pointer"><div className={`w-5 h-5 rounded shadow-inner ${colors.vacation}`}></div><span>Férias/Licença</span></div>
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

                <button onClick={handleDownloadClick} disabled={isGeneratingPdf} className="mt-2 w-full py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-colors disabled:bg-teal-300 disabled:cursor-not-allowed">
                  <FontAwesomeIcon icon={faFilePdf} className="mr-2" /> {isGeneratingPdf ? 'Gerando PDF...' : 'Baixar Calendário (PDF)'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {colorPickerState.visible && <ColorPicker position={colorPickerState.position} onSelectColor={handleSelectColor} onClose={() => setColorPickerState({ visible: false })} />}

        {showPdfModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Opções de Exportação</h3>

              <div className="space-y-4 mb-6">
                <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    name="pdfMode"
                    checked={pdfMode === 'full'}
                    onChange={() => setPdfMode('full')}
                    className="w-5 h-5 text-teal-600"
                  />
                  <div>
                    <span className="block font-semibold">Calendário Completo</span>
                    <span className="text-xs text-gray-500">Mês por página (detalhado)</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    name="pdfMode"
                    checked={pdfMode === 'compact'}
                    onChange={() => setPdfMode('compact')}
                    className="w-5 h-5 text-teal-600"
                  />
                  <div>
                    <span className="block font-semibold">Calendário Compacto</span>
                    <span className="text-xs text-gray-500">Ano inteiro em uma página</span>
                  </div>
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmPdfGeneration}
                  className="px-4 py-2 bg-teal-600 text-white font-bold rounded hover:bg-teal-700"
                >
                  Gerar PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div >
    </>
  );
}