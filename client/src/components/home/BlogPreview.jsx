import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, BookOpen, X } from 'lucide-react';
import { api } from '../../services/api';
import AnimatedSection from '../common/AnimatedSection';

export default function BlogPreview() {
  const [blogs, setBlogs] = useState([]);
  const [activeArticle, setActiveArticle] = useState(null);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const posts = await api.getBlogPosts();
        setBlogs(posts.slice(0, 3));
      } catch (err) {
        console.error('Failed to load blog preview:', err);
      }
    }
    loadBlogs();
  }, []);

  if (blogs.length === 0) return null;

  return (
    <section id="field-logs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24">
      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-accent-cyan">Field Research</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
              Engineering Reports & Whitepapers
            </h2>
            <p className="text-sm text-text-secondary mt-2">
              Metallurgy data, thermal cutting analyses, and shipyard automation case studies.
            </p>
          </div>

          <Link
            to="/blog"
            className="btn-secondary text-xs flex items-center gap-2 self-start"
          >
            <span>View All Engineering Logs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </AnimatedSection>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((post, idx) => (
          <AnimatedSection key={post._id || post.slug} delay={idx * 0.1}>
            <article
              onClick={() => setActiveArticle(post)}
              className="card-surface border border-dark-border bg-dark-card rounded-xl overflow-hidden hover:border-neutral-500 transition-all flex flex-col justify-between group cursor-pointer h-full"
            >
              <div>
                <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-950">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/kran_vulcan_crawler.jpg';
                    }}
                    className="w-full h-full object-cover filter grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {post.readTime}
                    </span>
                    <span>•</span>
                    <span className="truncate">{post.author}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-text-secondary mt-2 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-dark-border/40 mt-4 flex items-center justify-between text-xs font-mono text-cyan-400 pt-3">
                <span>Read Full Brief</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          </AnimatedSection>
        ))}
      </div>

      {/* Quick Article Viewer Modal */}
      {activeArticle && (
        <div
          onClick={() => setActiveArticle(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full bg-dark-card border border-neutral-700 rounded-2xl overflow-hidden shadow-2xl p-6 sm:p-8"
          >
            <div className="flex items-center justify-between border-b border-dark-border pb-3 mb-4">
              <span className="text-[10px] font-mono uppercase text-cyan-400">
                ENGINEERING LOG • {activeArticle.readTime}
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-1 rounded text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{activeArticle.title}</h3>
            <p className="text-xs font-mono text-neutral-400 mb-4">Authored by {activeArticle.author}</p>

            <div className="text-xs sm:text-sm text-neutral-300 space-y-4 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              <p className="font-semibold text-white">{activeArticle.excerpt}</p>
              <p>{activeArticle.content}</p>
              <p className="text-neutral-400">
                Detailed toolpath coordinate logs, gas cylinder consumption charts, and third-party ultrasonic metallurgy reports can be retrieved by platform operators from the dashboard.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-dark-border flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="btn-primary text-xs px-5 py-2 font-mono"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
