import { Link, useNavigate, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { authApi, quizApi } from '../app/api/config';

// Default quiz for initial state
const defaultQuiz = {
  id: 0,
  title: 'Loading Quiz...',
  subtitle: '',
  course_title: '',
  total_questions: 0,
  questions: [],
  time_limit: 600,
};

function DivScreenId() {
  return null;
}

function DivLogoMark() {
  return (
    <div className="bg-[#bfff00] content-stretch flex items-center justify-center pb-[4.91px] pt-[4.09px] relative rounded-[10px] shrink-0 size-[38px]">
      <div className="flex flex-col font-['Noto_Color_Emoji:Regular','Noto_Sans:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[18px] text-black text-center whitespace-nowrap">
        <p className="leading-[28.8px]">🧠</p>
      </div>
    </div>
  );
}

function DivLogoName() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[0px] text-left text-white tracking-[-0.36px] uppercase whitespace-nowrap">
        <p className="text-[18px]">
          <span className="leading-[28.8px] text-white">FLUENT</span>
          <span className="leading-[28.8px] text-[#bfff00]">FUSION</span>
        </p>
      </div>
    </div>
  );
}

function ALogo({ onClick }: { onClick: () => void }) {
  return (
    <div onClick={onClick} className="cursor-pointer relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11px] items-center relative">
        <DivLogoMark />
        <DivLogoName />
      </div>
    </div>
  );
}

function NavNav({ quiz, currentQuestion, timer }: { quiz: any; currentQuestion: number; timer: number }) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="backdrop-blur-[8px] bg-[rgba(10,10,10,0.95)] h-[66px] shrink-0 sticky top-0 w-full">
      <div aria-hidden="true" className="absolute border-[#2a2a2a] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-px px-[40px] relative size-full">
          <ALogo onClick={() => {}} />
          <div className="h-[33.19px] relative shrink-0">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
              {/* Quiz Info */}
              <div className="-translate-y-1/2 absolute content-stretch flex flex-col items-start left-0 pb-[0.8px] top-[calc(50%-0.51px)]">
                <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[13px] whitespace-nowrap">
                  <p className="leading-[20.8px]">{quiz?.title || 'Unit 3 Quiz'} · Question {currentQuestion + 1} of {quiz?.total_questions || 5}</p>
                </div>
              </div>
              
              {/* Timer */}
              <div className="-translate-y-1/2 absolute bg-[rgba(255,68,68,0.12)] content-stretch flex flex-col items-start left-[179.32px] pb-[7.19px] pt-[6px] px-[15px] rounded-[8px] top-1/2">
                <div className="absolute border border-[rgba(255,68,68,0.25)] border-solid inset-0 pointer-events-none rounded-[8px]" />
                <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#f44] text-[11.4px] whitespace-nowrap">
                  <p className="leading-[19.2px]">⏱ {formatTime(timer)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Header with quiz info and progress
function Header({ quiz, currentQuestion, answers, questionStates }: { quiz: any; currentQuestion: number; answers: { [key: number]: any }; questionStates: string[] }) {
  return (
    <div className="bg-[#151515] relative rounded-[20px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-[25px] pt-[24px] px-[29px] relative w-full">
          {/* Quiz Title */}
          <div className="relative shrink-0">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-px items-start relative">
              <div className="flex flex-col font-['DM_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[15px] text-white whitespace-nowrap">
                <p className="leading-[24px]">{quiz?.title || 'Unit 3'} · {quiz?.subtitle || 'Hotel Check-in Quiz'}</p>
              </div>
              <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[12px] whitespace-nowrap">
                <p className="leading-[19.2px]">{quiz?.course_title || 'English for Tourism'} · {quiz?.total_questions || 5} Questions</p>
              </div>
            </div>
          </div>
          
          {/* Progress */}
          <div className="relative shrink-0">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative">
              {/* Current Question */}
              <div className="content-stretch flex flex-col items-start pb-px relative shrink-0">
                <div className="content-stretch flex flex-col items-center mb-[-1px] relative shrink-0 w-full">
                  <div className="flex flex-col font-['Syne:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[22px] text-center whitespace-nowrap">
                    <p className="leading-[35.2px]">{currentQuestion + 1}/{quiz?.total_questions || 5}</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-col items-center mb-[-1px] pb-[0.59px] relative shrink-0 w-full">
                  <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] text-center whitespace-nowrap">
                    <p className="leading-[17.6px]">Progress</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#2a2a2a] h-[40px] shrink-0 w-px" />
              
              {/* Question Dots */}
              <div className="content-stretch flex items-start relative shrink-0">
                {(quiz?.questions || []).map((_: any, idx: number) => (
                  <div 
                    key={idx}
                    className={`rounded-[5px] shrink-0 size-[10px] ${
                      idx === currentQuestion 
                        ? 'bg-[#bfff00] shadow-[0px_0px_4px_0px_rgba(191,255,0,0.5)]' 
                        : questionStates[idx] === 'correct'
                          ? 'bg-[#00ff7f]'
                          : questionStates[idx] === 'incorrect'
                            ? 'bg-[#ff4444]'
                            : answers[idx] !== undefined
                              ? 'bg-[#bfff00]'
                              : 'bg-[#2a2a2a]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Multiple Choice Question
function MultipleChoiceQuestion({ question, currentAnswer, onSelect, disabled }: { 
  question: any; 
  currentAnswer: string | null; 
  onSelect: (optionId: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="bg-[#151515] relative rounded-[20px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="content-stretch flex flex-col gap-[13.3px] items-start p-[33px] relative w-full">
        {/* Question Type */}
        <div className="relative shrink-0 w-full">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
            <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[10px] tracking-[1.2px] uppercase w-full">
              <p className="leading-[16px] whitespace-pre-wrap">Multiple Choice · Question {question?.id}</p>
            </div>
          </div>
        </div>
        
        {/* Question Text */}
        <div className="relative shrink-0 w-full">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.75px] relative w-full">
            <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[28.5px] relative shrink-0 text-[19px] text-white w-full whitespace-pre-wrap">
              <p className="mb-0">{question?.question}</p>
            </div>
          </div>
        </div>
        
        {/* Options */}
        <div className="relative shrink-0 w-full">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[10px] items-start pt-[10.7px] relative w-full">
            {(question?.options || []).map((option: any) => {
              const isSelected = currentAnswer === option.id;
              return (
                <div 
                  key={option.id}
                  onClick={() => !disabled && onSelect(option.id)}
                  className={`relative rounded-[14px] shrink-0 w-full cursor-pointer ${disabled ? 'opacity-60' : ''}`}
                >
                  <div className={`${isSelected ? 'bg-[rgba(191,255,0,0.1)] border-2 border-[#bfff00]' : 'bg-[#1f1f1f] border-2 border-[#333]'} relative rounded-[14px]`}>
                    <div className="flex flex-row items-center size-full">
                      <div className="content-stretch flex gap-[12px] items-center px-[19px] py-[15px] relative w-full">
                        <div className={`relative rounded-[6px] shrink-0 size-[28px] ${isSelected ? 'bg-[#bfff00] border-2 border-[#bfff00]' : 'bg-[#2a2a2a] border-2 border-[#333]'}`}>
                          <div className="flex items-center justify-center size-full">
                            <div className="flex flex-col font-['JetBrains_Mono:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-center whitespace-nowrap">
                              <p className="leading-[19.2px]">{option.id}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[14px] text-white whitespace-nowrap">
                          <p className="leading-[22.4px]">{option.text}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Fill in the Blank Question
function FillInBlankQuestion({ question, currentAnswer, onChange, disabled }: { 
  question: any; 
  currentAnswer: string; 
  onChange: (answer: string) => void;
  disabled: boolean;
}) {
  return (
    <div className={`bg-[#151515] relative rounded-[20px] shrink-0 w-full ${disabled ? 'opacity-60' : ''}`}>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="content-stretch flex flex-col gap-[13.3px] items-start p-[33px] relative w-full">
        {/* Question Type */}
        <div className="relative shrink-0 w-full">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
            <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[10px] tracking-[1.2px] uppercase w-full">
              <p className="leading-[16px] whitespace-pre-wrap">Fill in the Blank · Question {question?.id}</p>
            </div>
          </div>
        </div>
        
        {/* Question Text */}
        <div className="relative shrink-0 w-full">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[11.45px] relative w-full">
            <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[28.5px] relative shrink-0 text-[19px] text-white w-full whitespace-pre-wrap">
              <p className="mb-0">{question?.question}</p>
            </div>
          </div>
        </div>
        
        {/* Input */}
        <div className="bg-[#1f1f1f] relative rounded-[14px] shrink-0 w-full">
          <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center p-[18px] relative w-full">
              <input
                type="text"
                value={currentAnswer}
                onChange={(e) => !disabled && onChange(e.target.value)}
                placeholder="Type your answer..."
                disabled={disabled}
                className="flex-[1_0_0] min-h-px min-w-px bg-transparent border-0 border-[transparent] border-solid text-[#fff] text-[17px] w-full focus:outline-none placeholder:text-[#757575]"
              />
            </div>
          </div>
          <div aria-hidden="true" className="absolute border-2 border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
        </div>
      </div>
    </div>
  );
}

// Listening Question
function ListeningQuestion({ question, currentAnswer, onChange, onPlayAudio, isPlaying, currentTime, duration, disabled }: { 
  question: any; 
  currentAnswer: string; 
  onChange: (answer: string) => void;
  onPlayAudio: () => void;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  disabled: boolean;
}) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-[#151515] relative rounded-[20px] shrink-0 w-full ${disabled ? 'opacity-40' : ''}`}>
      <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="content-stretch flex flex-col gap-[13px] items-start px-[33px] py-[29px] relative w-full">
        {/* Question Type */}
        <div className="relative shrink-0 w-full">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
            <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[10px] tracking-[1.2px] uppercase w-full">
              <p className="leading-[16px] whitespace-pre-wrap">Listening · Question {question?.id}</p>
            </div>
          </div>
        </div>
        
        {/* Question Text */}
        <div className="relative shrink-0 w-full">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[11px] relative w-full">
            <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[19px] text-white w-full">
              <p className="leading-[28.5px] whitespace-pre-wrap">Listen to the audio and type what you hear:</p>
            </div>
          </div>
        </div>
        
        {/* Audio Player */}
        <div className="bg-[#1f1f1f] relative rounded-[14px] shrink-0 w-full">
          <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
          <div className="flex flex-row items-center size-full">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center pb-[28px] pt-[21px] px-[21px] relative w-full">
              {/* Play Button */}
              <button 
                onClick={onPlayAudio}
                disabled={disabled}
                className="bg-[#bfff00] relative rounded-[24px] shrink-0 size-[48px] hover:opacity-90 disabled:opacity-50"
              >
                <div className="flex items-center justify-center size-full">
                  <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[18px] text-black text-center whitespace-nowrap">
                    <p className="leading-[28.8px]">{isPlaying ? '⏸' : '▶'}</p>
                  </div>
                </div>
              </button>
              
              {/* Audio Info */}
              <div className="relative shrink-0">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[5px] items-start relative">
                  <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[13px] text-white whitespace-nowrap">
                    <p className="leading-[20.8px]">{isPlaying ? 'Playing...' : 'Play Audio'}</p>
                  </div>
                  <div className="flex flex-col font-['DM_Sans:9pt_Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#888] text-[11px] whitespace-nowrap">
                    <p className="leading-[17.6px]">{formatTime(currentTime)} / {formatTime(duration)}</p>
                  </div>
                </div>
              </div>
              
              {/* Waveform */}
              <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[4px] bg-[#2a2a2a]">
                <div className="absolute inset-[0_45%_0_0] bg-[rgba(191,255,0,0.4)] rounded-[4px]" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Input */}
        <div className="bg-[#1f1f1f] relative rounded-[14px] shrink-0 w-full">
          <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center p-[18px] relative w-full">
              <input
                type="text"
                value={currentAnswer}
                onChange={(e) => !disabled && onChange(e.target.value)}
                placeholder="Type what you hear..."
                disabled={disabled}
                className="flex-[1_0_0] min-h-px min-w-px bg-transparent border-0 border-[transparent] border-solid text-[#fff] text-[16.9px] w-full focus:outline-none placeholder:text-[#757575]"
              />
            </div>
          </div>
          <div aria-hidden="true" className="absolute border-2 border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
        </div>
      </div>
    </div>
  );
}

// Quiz Card
function QuizCard({ 
  quiz, 
  currentQuestion, 
  currentAnswer, 
  onAnswerChange, 
  onSelectOption,
  onPrevious,
  onSubmit,
  isLastQuestion,
  questionStates,
  answers,
}: { 
  quiz: any; 
  currentQuestion: number; 
  currentAnswer: any; 
  onAnswerChange: (answer: any) => void;
  onSelectOption: (optionId: string) => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isLastQuestion: boolean;
  questionStates: string[];
  answers: any[];
}) {
  const question = quiz?.questions?.[currentQuestion];
  const isAudioPlaying = false;
  const audioCurrentTime = 0;
  const audioDuration = question?.audioDuration || 8;

  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start max-w-[680px] relative shrink-0 w-[680px]">
      <Header 
        quiz={quiz} 
        currentQuestion={currentQuestion} 
        answers={answers}
        questionStates={questionStates}
      />
      
      {/* Current Question */}
      {question?.type === 'multiple_choice' && (
        <MultipleChoiceQuestion 
          question={question} 
          currentAnswer={currentAnswer}
          onSelect={onSelectOption}
          disabled={false}
        />
      )}
      
      {question?.type === 'fill_blank' && (
        <FillInBlankQuestion 
          question={question} 
          currentAnswer={currentAnswer || ''}
          onChange={onAnswerChange}
          disabled={false}
        />
      )}
      
      {question?.type === 'listening' && (
        <ListeningQuestion 
          question={question} 
          currentAnswer={currentAnswer || ''}
          onChange={onAnswerChange}
          onPlayAudio={() => {}}
          isPlaying={isAudioPlaying}
          currentTime={audioCurrentTime}
          duration={audioDuration}
          disabled={false}
        />
      )}
      
      {/* Preview of next questions */}
      {quiz?.questions?.slice(currentQuestion + 1).map((q: any, idx: number) => (
        <div key={q.id} className={`bg-[#151515] opacity-60 relative rounded-[20px] shrink-0 w-full ${q.type === 'listening' ? 'opacity-40' : ''}`}>
          <div aria-hidden="true" className="absolute border border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[20px]" />
          <div className="content-stretch flex flex-col gap-[13.3px] items-start p-[33px] relative w-full">
            <div className="relative shrink-0 w-full">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
                <div className="flex flex-col font-['JetBrains_Mono:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#bfff00] text-[10px] tracking-[1.2px] uppercase w-full">
                  <p className="leading-[16px] whitespace-pre-wrap">
                    {q.type === 'multiple_choice' ? 'Multiple Choice' : q.type === 'fill_blank' ? 'Fill in the Blank' : 'Listening'} · Question {q.id}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative shrink-0 w-full">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.75px] relative w-full">
                <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[28.5px] relative shrink-0 text-[19px] text-white w-full whitespace-pre-wrap">
                  <p className="mb-0">{q.question}</p>
                </div>
              </div>
            </div>
            
            {/* Placeholder for preview */}
            <div className="bg-[#1f1f1f] relative rounded-[14px] shrink-0 w-full">
              <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center p-[18px] relative w-full">
                  <div className="flex-[1_0_0] min-h-px min-w-px relative">
                    <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#757575] text-[17px] text-center whitespace-nowrap">
                      <p className="leading-[normal]">
                        {q.type === 'multiple_choice' ? 'Select an answer...' : q.type === 'fill_blank' ? 'Type your answer...' : 'Type what you hear...'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="absolute border-2 border-[#2a2a2a] border-solid inset-0 pointer-events-none rounded-[14px]" />
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation Buttons */}
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
        <button 
          onClick={onPrevious}
          disabled={currentQuestion === 0}
          className="content-stretch flex items-center justify-center px-[24px] py-[11px] relative rounded-[8px] shrink-0 border border-[#333] hover:bg-[#1f1f1f] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#888] text-[14px] text-center tracking-[0.14px] whitespace-nowrap">
            <p className="leading-[normal]">← Previous</p>
          </div>
        </button>
        
        <button 
          onClick={onSubmit}
          className="bg-[#bfff00] content-stretch flex items-center justify-center px-[36px] py-[15px] relative rounded-[10px] shadow-[0px_0px_12px_0px_rgba(191,255,0,0.25)] shrink-0 hover:opacity-90"
        >
          <div className="flex flex-col font-['DM_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#0a0a0a] text-[16px] text-center tracking-[0.16px] whitespace-nowrap">
            <p className="leading-[normal]">{isLastQuestion ? 'Finish Quiz →' : 'Submit Answer →'}</p>
          </div>
        </button>
      </div>
    </div>
  );
}

export default function Component14Quiz() {
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();
  
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Quiz state - from API
  const [quiz, setQuiz] = useState<any>(defaultQuiz);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [questionStates, setQuestionStates] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(272); // 4:32 as in the original
  
  // Check auth and fetch quiz on mount
  useEffect(() => {
    const fetchQuiz = async () => {
      const token = localStorage.getItem('ff_access_token');
      const userData = authApi.getCurrentUser();
      
      if (!token || !userData) {
        navigate('/login');
        return;
      }
      
      setUser(userData);
      
      // Fetch quiz from API
      if (quizId) {
        try {
          const data = await quizApi.getQuiz(parseInt(quizId));
          
          // Transform API response to UI format
          const quizData = data.quiz;
          const questionsList = data.questions || [];
          
          setQuiz({
            id: quizData.id,
            title: quizData.title,
            subtitle: quizData.description || 'Quiz',
            course_title: quizData.course?.title || 'Course',
            total_questions: questionsList.length,
            time_limit: quizData.time_limit || 600,
            questions: questionsList.map((q: any, idx: number) => ({
              id: q.id,
              type: q.question_type || 'multiple_choice',
              question: q.question_text,
              options: q.options?.map((opt: any, optIdx: number) => ({
                id: String.fromCharCode(65 + optIdx), // A, B, C, D (display letter)
                db_id: opt.id, // actual database ID for submission
                text: opt.option_text || opt.text,
                is_correct: opt.is_correct,
              })),
              correctAnswer: q.correct_answer,
              audioUrl: q.audio_url,
              audioDuration: q.audio_duration || 8,
            })),
          });
          
          // Initialize question states
          setQuestionStates(new Array(questionsList.length).fill(''));
          
          setError(null);
        } catch (err: any) {
          console.error('Failed to load quiz:', err);
          setError(err.message || 'Failed to load quiz');
          // Still set empty question states
          setQuestionStates(new Array(5).fill(''));
        }
      }
      
      setIsLoading(false);
    };
    
    fetchQuiz();
  }, [quizId, navigate]);
  
  // Timer countdown
  useEffect(() => {
    if (isLoading) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up - submit quiz
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isLoading]);
  
  const handleSelectOption = (optionId: string) => {
    setAnswers({ ...answers, [currentQuestion]: optionId });
  };
  
  const handleAnswerChange = (answer: any) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  // Quiz completed - submit to API
  const handleSubmit = async () => {
    // Check if answer is provided
    const currentAnswer = answers[currentQuestion];
    if (currentAnswer === undefined || currentAnswer === '') {
      alert('Please provide an answer before submitting.');
      return;
    }
    
    // Mark current question as answered
    const newStates = [...questionStates];
    newStates[currentQuestion] = 'answered';
    setQuestionStates(newStates);
    
    // Move to next question or finish
    if (currentQuestion < (quiz?.questions?.length || 5) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed - submit to API
      try {
        const formattedAnswers = Object.entries(answers).map(([questionIdx, answer]) => {
          const question = quiz.questions[parseInt(questionIdx)];
          // For multiple choice, answer is the display letter (A/B/C/D).
          // Look up the actual integer option ID for submission.
          let selectedOptionId: number | undefined;
          let textAnswer: string | undefined;
          if (typeof answer === 'string' && question?.options) {
            const matchedOption = question.options.find((opt: any) => opt.id === answer);
            if (matchedOption?.db_id !== undefined) {
              selectedOptionId = matchedOption.db_id;
            } else {
              // Free-text answer (fill-in-blank, speaking, translation)
              textAnswer = answer;
            }
          }
          return {
            question_id: question.id,
            answer: textAnswer,
            selected_option_id: selectedOptionId,
          };
        });
        
        const result = await quizApi.submitQuiz(parseInt(quizId || '0'), formattedAnswers);
        
        alert(`Quiz completed! Score: ${result.score}/${result.total_points} (${result.passed ? 'Passed' : 'Failed'})`);
      } catch (err: any) {
        console.error('Failed to submit quiz:', err);
        alert('Quiz completed! (Could not submit to server)');
      }
      navigate('/dashboard');
    }
  };
  
  const isLastQuestion = currentQuestion === (quiz?.questions?.length || 5) - 1;
  const currentAnswer = answers[currentQuestion];
  
  // Convert answers object to array for QuizCard
  const answersArray = quiz?.questions?.map((_: any, idx: number) => answers[idx]) || [];

  if (isLoading) {
    return (
      <div className="bg-[#0a0a0a] content-stretch flex flex-col gap-[48px] items-center pb-[48px] relative min-h-screen">
        <DivScreenId />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin text-[32px]">🧠</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] content-stretch flex flex-col gap-[48px] items-center pb-[48px] relative min-h-screen">
      <DivScreenId />
      <NavNav quiz={quiz} currentQuestion={currentQuestion} timer={timeLeft} />
      <QuizCard 
        quiz={quiz}
        currentQuestion={currentQuestion}
        currentAnswer={currentAnswer}
        onAnswerChange={handleAnswerChange}
        onSelectOption={handleSelectOption}
        onPrevious={handlePrevious}
        onSubmit={handleSubmit}
        isLastQuestion={isLastQuestion}
        questionStates={questionStates}
        answers={answersArray}
      />
    </div>
  );
}
