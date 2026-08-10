import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronDown, Check, Copy, HelpCircle, BookOpenCheck, ChevronUp, GraduationCap, Users } from 'lucide-react';
import KineticHeading from './KineticHeading';
import { INTERNAL_ASSIGNMENTS, BOARD_ASSIGNMENTS } from '../data/assignmentsData';
import type { InternalAssignment, BoardAssignmentDivision } from '../data/assignmentsData';

const Assignments = () => {
  const [activeTab, setActiveTab] = useState<'internal' | 'board'>('internal');
  const [openAssignmentId, setOpenAssignmentId] = useState<number | null>(1);
  
  // Board Assignment state: selected division defaults to 'Division A'
  const [selectedDivisionName, setSelectedDivisionName] = useState<string>('Division A');
  const [expandedAnswerId, setExpandedAnswerId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleAssignment = (id: number) => {
    setOpenAssignmentId((prev) => (prev === id ? null : id));
  };

  const toggleAnswer = (key: string) => {
    setExpandedAnswerId((prev) => (prev === key ? null : key));
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAllInternal = (assignment: InternalAssignment) => {
    const text = `${assignment.title}\n\n` + 
      assignment.questions.map((q) => `Q${q.id}) ${q.question}\n\nAnswer:\n${q.answer}\n`).join('\n----------------------------------------\n\n');
    navigator.clipboard.writeText(text);
    setCopiedId(`all-internal-${assignment.id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAllBoard = (division: BoardAssignmentDivision) => {
    const text = `${division.division} Journal Questions Q&As:\n\n` + 
      division.questions.map((q) => `Q${q.id}) ${q.question}\n\nAnswer:\n${q.answer}\n`).join('\n----------------------------------------\n\n');
    navigator.clipboard.writeText(text);
    setCopiedId(`all-board-${division.division}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const selectedBoardDivision = BOARD_ASSIGNMENTS.find(
    (d) => d.division === selectedDivisionName
  ) || BOARD_ASSIGNMENTS[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-4xl px-4 flex flex-col gap-8"
    >
      <div className="text-center space-y-3 sm:space-y-4">
        <KineticHeading as="h1" text="Assignments" className="text-3xl sm:text-4xl text-ink font-heading font-bold" glowSweep />
        <p className="text-xs sm:text-sm text-ink-light max-w-lg mx-auto px-2 font-body">
          Access your EVS course assignments, model answers, and journal questions.
        </p>
      </div>

      {/* Main Tabs: Internal vs Board/Journal */}
      <div className="flex p-1 bg-surface/50 border border-border rounded-xl mx-auto w-full max-w-md backdrop-blur-md" role="tablist" aria-label="Assignment type navigation">
        <button
          role="tab"
          aria-selected={activeTab === 'internal'}
          onClick={() => setActiveTab('internal')}
          className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-4 rounded-lg font-medium text-xs sm:text-sm transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
            activeTab === 'internal'
              ? 'bg-surface text-ink shadow-sm border border-border/60 font-semibold'
              : 'text-ink-light hover:text-ink hover:bg-surface/50'
          }`}
        >
          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span>Internal Assignments</span>
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'board'}
          onClick={() => setActiveTab('board')}
          className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-4 rounded-lg font-medium text-xs sm:text-sm transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
            activeTab === 'board'
              ? 'bg-surface text-ink shadow-sm border border-border/60 font-semibold'
              : 'text-ink-light hover:text-ink hover:bg-surface/50'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span>Journal Questions</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'internal' ? (
          <motion.div
            key="internal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            {INTERNAL_ASSIGNMENTS.map((assignment) => {
              const isOpen = openAssignmentId === assignment.id;
              const contentId = `internal-content-${assignment.id}`;

              return (
                <motion.div
                  key={assignment.id}
                  initial={false}
                  className="rounded-2xl bg-surface/80 backdrop-blur-md border border-border overflow-hidden shadow-sm hover:border-accent/30 transition-all duration-300"
                >
                  <button
                    onClick={() => toggleAssignment(assignment.id)}
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left group hover:bg-surface/40 transition-colors gap-3 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded-2xl"
                  >
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-grow min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-105 transition-transform flex-shrink-0 mt-0.5 sm:mt-0">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                          <h2 className="text-lg sm:text-xl font-heading font-semibold text-ink group-hover:text-accent transition-colors leading-tight">
                            {assignment.title}
                          </h2>
                          <span className="self-start sm:self-auto inline-flex items-center px-2.5 py-1 text-[11px] sm:text-xs font-semibold bg-accent/15 text-accent rounded-lg sm:rounded-full border border-accent/20 leading-tight">
                            {assignment.questions.length} Questions · ~200-Word Answers
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-ink-light mt-1 sm:mt-0.5 font-body">{assignment.subtitle}</p>
                      </div>
                    </div>

                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-surface border border-border flex items-center justify-center text-ink-light group-hover:text-ink transition-colors flex-shrink-0 ml-1"
                    >
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={contentId}
                        role="region"
                        aria-label={`${assignment.title} questions`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                      >
                        <div className="px-3.5 sm:px-6 pb-4 sm:pb-6 pt-2 border-t border-border/50">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 my-3 sm:my-4">
                            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-ink-light uppercase tracking-wider">
                              <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
                              <span>Questions & ~200-Word Answers</span>
                            </div>

                            <button
                              onClick={() => handleCopyAllInternal(assignment)}
                              className="flex items-center justify-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-lg bg-surface border border-border text-ink hover:bg-surface/80 transition-colors shadow-sm w-full sm:w-auto focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                            >
                              {copiedId === `all-internal-${assignment.id}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-success" />
                                  <span className="text-success font-semibold">Copied All Q&As</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-accent" />
                                  <span>Copy All Q&As</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-3.5 sm:gap-4">
                            {assignment.questions.map((q) => {
                              const qKey = `internal-${assignment.id}-${q.id}`;
                              const isAnswerOpen = expandedAnswerId === qKey;
                              const isCopiedQuestion = copiedId === `q-${qKey}`;
                              const isCopiedAnswer = copiedId === `a-${qKey}`;
                              const answerRegionId = `answer-region-${qKey}`;

                              return (
                                <motion.div
                                  key={q.id}
                                  className="flex flex-col rounded-xl bg-surface/60 border border-border/80 hover:border-accent/40 transition-all overflow-hidden"
                                >
                                  <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-start gap-2.5 flex-grow min-w-0">
                                      <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-accent/10 text-accent font-semibold text-xs flex items-center justify-center mt-0.5">
                                        Q{q.id}
                                      </span>
                                      <div className="min-w-0 flex-grow">
                                        <h3 className="text-ink font-semibold text-sm sm:text-base leading-snug pt-0.5 font-heading">
                                          {q.question}
                                        </h3>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0 w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 border-border/30">
                                      <button
                                        onClick={() => handleCopyText(`Q${q.id}) ${q.question}`, `q-${qKey}`)}
                                        title="Copy Question"
                                        aria-label={`Copy Question ${q.id}`}
                                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-ink-light hover:text-accent hover:bg-accent/10 transition-all bg-surface/50 border border-border/40 sm:border-0 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                                      >
                                        {isCopiedQuestion ? (
                                          <>
                                            <Check className="w-3.5 h-3.5 text-success" />
                                            <span className="text-success font-semibold sm:hidden">Copied</span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="w-3.5 h-3.5" />
                                            <span className="sm:hidden text-ink-light">Copy Q</span>
                                          </>
                                        )}
                                      </button>

                                      <button
                                        onClick={() => toggleAnswer(qKey)}
                                        aria-expanded={isAnswerOpen}
                                        aria-controls={answerRegionId}
                                        className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
                                          isAnswerOpen
                                            ? 'bg-accent text-white shadow-glow'
                                            : 'bg-accent/10 text-accent hover:bg-accent/20'
                                        }`}
                                      >
                                        <BookOpenCheck className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span>
                                          {isAnswerOpen ? 'Hide Answer' : 'View Answer'}
                                          <span className="hidden sm:inline"> (~200 words)</span>
                                        </span>
                                        {isAnswerOpen ? (
                                          <ChevronUp className="w-3.5 h-3.5 flex-shrink-0" />
                                        ) : (
                                          <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
                                        )}
                                      </button>
                                    </div>
                                  </div>

                                  <AnimatePresence>
                                    {isAnswerOpen && (
                                      <motion.div
                                        id={answerRegionId}
                                        role="region"
                                        aria-label={`Answer for Question ${q.id}`}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="border-t border-border/60 bg-surface/40 p-3.5 sm:p-5"
                                      >
                                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/40 gap-2">
                                          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-accent uppercase tracking-wider">
                                            <BookOpenCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
                                            <span>Model Answer <span className="hidden sm:inline">(~200 Words)</span></span>
                                          </div>

                                          <button
                                            onClick={() => handleCopyText(q.answer, `a-${qKey}`)}
                                            aria-label={`Copy Model Answer for Question ${q.id}`}
                                            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded bg-surface border border-border text-ink hover:bg-surface/80 transition-colors flex-shrink-0 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                                          >
                                            {isCopiedAnswer ? (
                                              <>
                                                <Check className="w-3 h-3 text-success" />
                                                <span className="text-success font-semibold">Copied!</span>
                                              </>
                                            ) : (
                                              <>
                                                <Copy className="w-3 h-3 text-accent" />
                                                <span>Copy Answer</span>
                                              </>
                                            )}
                                          </button>
                                        </div>

                                        <div className="text-ink/90 text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-2 font-normal font-body">
                                          {q.answer}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="board"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Division Selection Section */}
            <div className="rounded-2xl bg-surface/80 backdrop-blur-md border border-border p-4 sm:p-6 shadow-sm flex flex-col gap-3 sm:gap-4">
              <div className="flex items-center gap-2.5 text-ink">
                <Users className="w-5 h-5 text-accent flex-shrink-0" />
                <h2 className="text-base sm:text-lg font-heading font-semibold">Select Your Division</h2>
              </div>
              <p className="text-xs sm:text-sm text-ink-light font-body">
                Choose your division below to access your assigned journal questions and model answers.
              </p>

              {/* Division Selector Pills */}
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-2.5 pt-1" role="group" aria-label="Division selection">
                {BOARD_ASSIGNMENTS.map((div) => {
                  const isSelected = div.division === selectedDivisionName;
                  return (
                    <button
                      key={div.division}
                      onClick={() => setSelectedDivisionName(div.division)}
                      aria-pressed={isSelected}
                      aria-label={`Select ${div.division}`}
                      className={`py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
                        isSelected
                          ? 'bg-accent text-white shadow-glow border border-accent/50 scale-[1.02]'
                          : 'bg-surface/70 border border-border text-ink hover:border-accent/40 hover:bg-surface'
                      }`}
                    >
                      <span className="font-semibold">{div.division}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Questions for Selected Division */}
            <motion.div
              key={selectedDivisionName}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl bg-surface/80 backdrop-blur-md border border-border p-4 sm:p-6 shadow-sm flex flex-col gap-4 sm:gap-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold bg-accent/15 text-accent rounded-full border border-accent/20 uppercase tracking-wider">
                      Selected Division
                    </span>
                    <h2 className="text-xl sm:text-2xl font-heading font-bold text-ink">
                      {selectedBoardDivision.division}
                    </h2>
                  </div>
                  <p className="text-xs text-ink-light mt-1 font-body">
                    5 Journal Questions & ~200-Word Model Answers
                  </p>
                </div>

                <button
                  onClick={() => handleCopyAllBoard(selectedBoardDivision)}
                  className="flex items-center justify-center gap-1.5 text-xs font-medium px-4 py-2 rounded-xl bg-surface border border-border text-ink hover:bg-surface/80 transition-colors shadow-sm w-full sm:w-auto focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                >
                  {copiedId === `all-board-${selectedBoardDivision.division}` ? (
                    <>
                      <Check className="w-4 h-4 text-success" />
                      <span className="text-success font-semibold">Copied All Division Q&As</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-accent" />
                      <span>Copy All Q&As</span>
                    </>
                  )}
                </button>
              </div>

              {/* Question list for the selected division */}
              <div className="grid grid-cols-1 gap-3.5 sm:gap-4">
                {selectedBoardDivision.questions.map((q) => {
                  const qKey = `board-${selectedBoardDivision.division}-${q.id}`;
                  const isAnswerOpen = expandedAnswerId === qKey;
                  const isCopiedQuestion = copiedId === `q-${qKey}`;
                  const isCopiedAnswer = copiedId === `a-${qKey}`;
                  const answerRegionId = `board-answer-region-${qKey}`;

                  return (
                    <motion.div
                      key={q.id}
                      className="flex flex-col rounded-xl bg-surface/60 border border-border/80 hover:border-accent/40 transition-all overflow-hidden"
                    >
                      <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-2.5 flex-grow min-w-0">
                          <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-accent/10 text-accent font-semibold text-xs flex items-center justify-center mt-0.5">
                            Q{q.id}
                          </span>
                          <div className="min-w-0 flex-grow">
                            <h3 className="text-ink font-semibold text-sm sm:text-base leading-snug pt-0.5 font-heading">
                              {q.question}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0 w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 border-border/30">
                          <button
                            onClick={() => handleCopyText(`Q${q.id}) ${q.question}`, `q-${qKey}`)}
                            title="Copy Question"
                            aria-label={`Copy Question ${q.id}`}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-ink-light hover:text-accent hover:bg-accent/10 transition-all bg-surface/50 border border-border/40 sm:border-0 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                          >
                            {isCopiedQuestion ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-success" />
                                <span className="text-success font-semibold sm:hidden">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span className="sm:hidden text-ink-light">Copy Q</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => toggleAnswer(qKey)}
                            aria-expanded={isAnswerOpen}
                            aria-controls={answerRegionId}
                            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
                              isAnswerOpen
                                ? 'bg-accent text-white shadow-glow'
                                : 'bg-accent/10 text-accent hover:bg-accent/20'
                            }`}
                          >
                            <BookOpenCheck className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>
                              {isAnswerOpen ? 'Hide Answer' : 'View Answer'}
                              <span className="hidden sm:inline"> (~200 words)</span>
                            </span>
                            {isAnswerOpen ? (
                              <ChevronUp className="w-3.5 h-3.5 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
                            )}
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isAnswerOpen && (
                          <motion.div
                            id={answerRegionId}
                            role="region"
                            aria-label={`Answer for Question ${q.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-border/60 bg-surface/40 p-3.5 sm:p-5"
                          >
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/40 gap-2">
                              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-accent uppercase tracking-wider">
                                <BookOpenCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
                                <span>Model Answer <span className="hidden sm:inline">(~200 Words)</span></span>
                              </div>

                              <button
                                onClick={() => handleCopyText(q.answer, `a-${qKey}`)}
                                aria-label={`Copy Model Answer for Question ${q.id}`}
                                className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded bg-surface border border-border text-ink hover:bg-surface/80 transition-colors flex-shrink-0 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                              >
                                {isCopiedAnswer ? (
                                  <>
                                    <Check className="w-3 h-3 text-success" />
                                    <span className="text-success font-semibold">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3 text-accent" />
                                    <span>Copy Answer</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <div className="text-ink/90 text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-2 font-normal font-body">
                              {q.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Assignments;
