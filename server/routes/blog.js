import express from 'express';
import BlogPost from '../models/BlogPost.js';
import mongoose from 'mongoose';

const router = express.Router();

const defaultBlogs = [
  {
    _id: 'b-1',
    title: 'Autonomous Robotics in Maritime Decommissioning',
    slug: 'autonomous-robotics-maritime-decommissioning',
    excerpt: 'How AI and specialized magnetic crawler robots are replacing hazardous manual torch dismantling at modern shipyards.',
    content: 'Ship breaking has historically been one of the most hazardous industrial trades in the world. With high-intensity autonomous plasma robots, robotic arms navigate multi-curved ship hulls while maintaining millimeter-level precision.',
    coverImage: '/images/kran_vulcan_crawler.jpg',
    author: 'Chief Engineer Zhao',
    tags: ['Robotics', 'Automation', 'Safety'],
    readTime: '4 min',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'b-2',
    title: 'Maximizing Scrap Steel Yield with AI Vision Path Planning',
    slug: 'maximizing-scrap-steel-yield-ai-vision',
    excerpt: 'Computer vision algorithms map internal structural frames to calculate optimal cut lines, reducing kerf loss by 18%.',
    content: 'By integrating LiDAR and optical scanning prior to cutting, robotic systems determine the optimal trajectory for cutting torch heads, maximizing usable secondary steel plate dimensions.',
    coverImage: '/images/robot_arm_torch.jpg',
    author: 'Dr. Sarah Lindqvist',
    tags: ['AI Vision', 'Metallurgy', 'Efficiency'],
    readTime: '6 min',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'b-3',
    title: 'The Green Ship Recycling Revolution: Zero Spill Mandates',
    slug: 'green-ship-recycling-zero-spills',
    excerpt: 'Complying with the Hong Kong Convention through robotic dry-cutting and closed-loop fume and runoff filtration.',
    content: 'Environmental safety is paramount in modern ship dismantling. Robotic operations eliminate human exposure to toxic paints, asbestos insulation, and heavy fuel residues.',
    coverImage: '/images/plasma_cut_hull.jpg',
    author: 'Maritime Operations Group',
    tags: ['Environment', 'Hong Kong Convention', 'Sustainability'],
    readTime: '5 min',
    createdAt: new Date().toISOString()
  }
];

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const posts = await BlogPost.find({ published: true }).sort({ createdAt: -1 });
      if (posts.length > 0) return res.json(posts);
    }
    return res.json(defaultBlogs);
  } catch (err) {
    return res.json(defaultBlogs);
  }
});

router.get('/:slug', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const post = await BlogPost.findOne({ slug: req.params.slug });
      if (post) return res.json(post);
    }
    const found = defaultBlogs.find(b => b.slug === req.params.slug) || defaultBlogs[0];
    return res.json(found);
  } catch (err) {
    return res.json(defaultBlogs[0]);
  }
});

export default router;
