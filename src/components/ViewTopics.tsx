import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock } from 'lucide-react';
import KineticHeading from './KineticHeading';

interface TopicData {
  id: number;
  division: string;
  topic: string;
  project_topic?: string | null;
  member2_project_topic?: string | null;
  has_uploaded: boolean;
}

const ViewTopics = () => {
  const [topics, setTopics] = useState<TopicData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('All');

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('/api/topics');
        const data = await response.json().catch(() => ({}));
        
        if (!response.ok) {
          throw new Error(data.error || 'Could not load topics right now.');
        }
        setTopics(data.topics || []);
      } catch (err: any) {
        console.error('Fetch topics error:', err);
        setError(err.message || 'We couldn\'t load the registered topics at the moment. Please try refreshing in a few moments.');
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const divisions = ['All', ...Array.from(new Set(topics.map(t => t.division)))].sort();
  const filteredTopics = selectedDivision === 'All' 
    ? topics 
    : topics.filter(t => t.division === selectedDivision);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-4xl px-4 flex flex-col gap-8"
    >
      <div className="text-center space-y-3 sm:space-y-4">
        <KineticHeading as="h1" text="Registered Topics" className="text-3xl sm:text-4xl text-ink font-heading font-bold" glowSweep />
        <p className="text-ink-light max-w-lg mx-auto">
          Explore the topics registered by other students. Names and roll numbers are hidden for privacy.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="w-8 h-8 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
        </div>
      ) : error || topics.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 px-4 rounded-2xl bg-surface/50 border border-border mt-4"
        >
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-heading text-ink mb-2">
            Looks a bit quiet here...
          </h3>
          <p className="text-ink-light max-w-sm mx-auto">
            {error 
              ? error 
              : 'It looks like no topics have been registered yet. Be the first to secure your topic!'}
          </p>
        </motion.div>
      ) : (
        <>
          <div className="flex justify-center gap-2 flex-wrap">
            {divisions.map(div => (
              <button
                key={div}
                onClick={() => setSelectedDivision(div)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedDivision === div 
                    ? 'bg-accent text-background shadow-glow font-medium'
                    : 'bg-card text-ink hover:bg-card-border'
                }`}
              >
                {div === 'All' ? 'All Divisions' : `Division ${div}`}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredTopics.map((topic, i) => (
                <motion.div
                  key={topic.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.5) }}
                >
                  <div className="editorial-card !p-0 text-left h-full flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
                    <div className="p-6 h-full flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold tracking-wider text-accent uppercase">
                          DIV {topic.division}
                        </span>
                        {topic.has_uploaded ? (
                          <div className="flex items-center gap-1 text-xs font-semibold text-success bg-success-soft px-3 py-1 rounded-full">
                            <CheckCircle size={12} />
                            <span>Uploaded</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs font-semibold text-ink-light bg-surface border border-border px-3 py-1 rounded-full">
                            <Clock size={12} />
                            <span>Pending</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow space-y-2">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-ink-light tracking-wider block mb-0.5">Seminar Presentation</span>
                          <h3 className="text-base font-semibold text-ink leading-tight">
                            {topic.topic}
                          </h3>
                        </div>

                        {(topic.project_topic || topic.member2_project_topic) && (
                          <div className="pt-2 border-t border-border/40 text-xs text-ink-light space-y-1">
                            <span className="text-[10px] uppercase font-bold text-accent/90 tracking-wider block mb-0.5">Blue Book Project(s)</span>
                            {topic.project_topic && (
                              <p className="text-ink/90 font-medium leading-snug">
                                {topic.member2_project_topic ? <span className="text-ink-light font-normal">M1: </span> : null}
                                {topic.project_topic}
                              </p>
                            )}
                            {topic.member2_project_topic && (
                              <p className="text-ink/90 font-medium leading-snug">
                                <span className="text-ink-light font-normal">M2: </span>{topic.member2_project_topic}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {filteredTopics.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="col-span-full text-center py-12 text-ink-light bg-surface/50 rounded-2xl border border-border"
                >
                  No topics found for this division yet.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ViewTopics;
