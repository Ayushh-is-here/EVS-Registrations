import { motion } from 'framer-motion';
import { Clock, Image, Target, Sparkles } from 'lucide-react';

import KineticHeading from './KineticHeading';

const Guidelines = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-2xl px-4"
    >
      <div className="editorial-card !max-w-none !p-0 mx-auto">
        <div className="p-6 sm:p-8 md:p-10 w-full h-full flex flex-col gap-6 sm:gap-7 text-ink">
          <div className="text-center mb-2 sm:mb-4">
            <KineticHeading as="h1" text="Presentation Guidelines" className="text-3xl sm:text-4xl text-ink font-heading font-bold" glowSweep />
            <p className="text-xs sm:text-sm text-ink-light mt-2 sm:mt-3 font-body">
              Keep it fun, keep it simple. Here is how to survive (and ace) your presentation.
            </p>
          </div>

          <div className="flex flex-col gap-5 sm:gap-6">
            <section className="flex items-start gap-3.5 sm:gap-4 p-4 rounded-xl bg-surface/50 border border-border/60 hover:border-accent/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-heading font-semibold text-ink leading-snug">
                  5 Minutes for PPT
                </h2>
                <p className="text-xs sm:text-sm text-ink-light leading-relaxed mt-1 font-body">
                  You have got exactly 5 minutes to dazzle us. If you go over, we might just start playing the Oscars wrap-up music. Practice your timing!
                </p>
              </div>
            </section>

            <section className="flex items-start gap-3.5 sm:gap-4 p-4 rounded-xl bg-surface/50 border border-border/60 hover:border-accent/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0 mt-0.5">
                <Image className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-heading font-semibold text-ink leading-snug">
                  Less Text, More Visuals
                </h2>
                <p className="text-xs sm:text-sm text-ink-light leading-relaxed mt-1 font-body">
                  Nobody wants to read an essay off a slide. Use pictures, memes, charts, or interpretive dance (just kidding, keep it on the slide). Bullet points are your best friends.
                </p>
              </div>
            </section>

            <section className="flex items-start gap-3.5 sm:gap-4 p-4 rounded-xl bg-surface/50 border border-border/60 hover:border-accent/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0 mt-0.5">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-heading font-semibold text-ink leading-snug">
                  Your Topic, Your Choice
                </h2>
                <p className="text-xs sm:text-sm text-ink-light leading-relaxed mt-1 font-body">
                  Pick something from your division that you actually care about. If you are bored talking about it, imagine how we will feel listening to it!
                </p>
              </div>
            </section>

            <section className="flex items-start gap-3.5 sm:gap-4 p-4 rounded-xl bg-surface/50 border border-border/60 hover:border-accent/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-heading font-semibold text-ink leading-snug">
                  Give Your Friends Some Competition
                </h2>
                <p className="text-xs sm:text-sm text-ink-light leading-relaxed mt-1 font-body">
                  If your entire friend group chooses the exact same topic... we might start thinking you all shared one brain cell. Try to pick something different if you can. Show off a bit!
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Guidelines;
