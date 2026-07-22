export const profile = {
  name: 'Jaeyeon Heo',
  title: 'AI/ML Engineer — Computer Vision × Robot Control',
  tagline: "I build on what I've learned and create what is needed.",
  email: 'jaeyeon.e.hoe@gmail.com',
  github: 'https://github.com/JaeyeonE',
  linkedin: 'https://www.linkedin.com/in/jaeyeonelenaheo/',
  velog: 'https://velog.io/@ght010522/posts',
}

export const interests = [
  {
    name: 'VLA',
    full: 'Vision-Language-Action',
    blurb: 'Grounding natural-language instructions into robot actions.',
  },
  {
    name: 'RL',
    full: 'Reinforcement Learning',
    blurb: 'Learning control policies from interaction and reward.',
  },
  {
    name: 'Robotics',
    full: 'Manipulation',
    blurb: 'Arm control, grasping, and sim-to-real transfer.',
  },
  {
    name: 'Vision',
    full: 'Computer Vision',
    blurb: 'Detection and perception that a robot can act on.',
  },
  {
    name: 'Active Vision',
    full: 'Active Vision',
    blurb: 'Moving the camera on purpose to see better, not just more.',
  },
]

export const education = [
  {
    org: 'Keimyung University',
    detail: 'B.S. in Computer Engineering & B.A. in Public Administration (dual degree)',
    period: 'Mar 2020 – Feb 2026',
  },
  {
    org: 'KG KAIROS Robotics Bootcamp',
    detail: 'Industrial robot control and simulation with ROS2 / MoveIt2, plus PLC-based automation',
    period: 'Dec 2025 – Jun 2026',
  },
  {
    org: 'EF Vancouver English Language Program',
    detail: 'Level C1',
    period: 'Sep 2022 – Feb 2023',
  },
]

export const experience = [
  {
    org: 'AGA Lab, UNIST',
    href: 'https://sites.google.com/view/aga-lab/',
    role: 'Researcher (incoming M.S. student)',
    period: 'Jul 2026 – Present',
    points: ['Working on Vision-Language-Action (VLA), reinforcement learning, and computer vision for robot manipulation.'],
  },
  {
    org: 'Computer Vision & Pattern Recognition Lab, Keimyung University',
    role: 'Undergraduate Research Assistant',
    period: 'Aug 2025 – Sep 2025',
    points: [
      'Reviewed the Vision Transformer (ViT) paper for the lab reading group.',
      'Built and tested a YOLOv8-based smoke and fire detection model (CUDA, Python).',
    ],
  },
]

export const certifications = [
  { name: 'Professional Machine Learning Engineer', org: 'Google Cloud', date: 'Nov 2025' },
  { name: 'OPIc — IH (Intermediate High)', org: 'ACTFL', date: '' },
]

export type Project = {
  slug: string
  title: string
  period: string
  role: string
  status?: string
  stack: string[]
  problem: string
  approach: string[]
  results: string[]
  links: { label: string; href: string }[]
  video?: { label: string; href: string; embedId?: string }
  stats?: { value: string; label: string }[]
  images?: { src: string; alt: string }[]
  draft?: boolean
}

export const projects: Project[] = [
  {
    slug: 'vla-grounding',
    title: 'VLA Grounding',
    period: 'Jan 2026',
    role: 'Personal project',
    stack: ['CLIP', 'Python', 'Zero-shot grounding', 'Prompt / heuristic reasoning'],
    problem:
      'How well can a robot understand a relational instruction like "place {object} onto {target}" using zero-shot, CLIP-based grounding with no additional training?',
    approach: [
      'Identified an early performance imbalance: Object Selection reached 46.7% while Target Grounding stalled at 20.0% (Exp #6–#8) — the model could find the object but not the placement location.',
      'Traced the bottleneck to a missing spatial-reasoning signal, and injected an Affordance Prior — prior knowledge of placeable regions — into the pipeline.',
      'Extended the pipeline to combine region information with the Affordance signal rather than relying on a single cue.',
      'Once Target Grounding gains plateaued, shifted the focus to overcoming the Object Selection accuracy ceiling rather than over-optimizing an already-saturated signal.',
    ],
    results: [
      'Target Grounding jumped 3.3× and Success Rate improved roughly 3× after adding the Affordance Prior.',
      'Quantified the zero-shot grounding ceiling under this setup.',
      'Success Rate plateaus at the Object Selection accuracy ceiling (46.7%) — the next real bottleneck.',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/JaeyeonE/VLA-Grounding-MVP' }],
    stats: [
      { value: '×3.3', label: 'Target Grounding gain after adding the Affordance Prior' },
      { value: '~×3', label: 'Success Rate improvement over the same step' },
      { value: '46.7%', label: 'Object Selection accuracy — the current ceiling on Success Rate' },
    ],
  },
  {
    slug: 'autonomous-refueling-robot',
    title: 'Autonomous Refueling Robot',
    period: 'Apr 2026',
    role: 'Team project · Project lead',
    stack: ['Doosan E0509', 'Intel RealSense D455', 'YOLOv12', 'ROS2', 'SQLite', 'Streamlit', 'OpenCV'],
    problem:
      'Fuel-port, cap, and nozzle geometry varies by vehicle; lighting and reflections make detection unstable; camera-to-robot-base coordinate transforms are error-prone; and the system provided no visibility into task status or failures.',
    approach: [
      'Designed a 4-layer system architecture — Perception → Control → Data → Service — built end-to-end on a Doosan E0509 arm with an Intel RealSense D455, YOLOv12, ROS2, SQLite, and Streamlit.',
      'Built an RGB-D perception pipeline for 3-class detection (fuel port / cap / nozzle), with a camera-to-robot-base coordinate transform feeding the grasp controller.',
      'Collected and annotated a refueling-specific dataset, used augmentation to mitigate limited data, and tuned hyperparameters for detection accuracy and inference speed.',
      'Applied OpenCV-based center correction to the model output to improve grasp precision.',
      'Designed a SQLite task-log schema (task ID, timestamp, vision coordinates, error code, status) with full-pipeline logging for monitoring.',
      'Led scheduling, task allocation, and interface coordination across the vision, control, and data modules.',
    ],
    results: [
      'Completed the full loop — detection → coordinate transform → grasp — in a mock environment.',
      'Next: deployment in a real-world environment, a VLA-based natural-language interface, and closed-loop calibration to reduce coordinate-transform error.',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/JaeyeonE/robotic-arm-refueler' }],
    video: {
      label: 'Watch demo',
      href: 'https://youtube.com/shorts/2rjvqGU6aQo?feature=share',
      embedId: '2rjvqGU6aQo',
    },
    images: [
      { src: 'refuel-ui', alt: 'Live monitoring UI detecting the fuel cap during a refueling run' },
      { src: 'refuel-gripper', alt: 'Doosan E0509 gripper aligning with the fuel cap mock-up' },
    ],
  },
  {
    slug: 'rotosy',
    title: 'RoToSY',
    period: '2026 · in progress',
    role: 'Team project · KG KAIROS Robotics Bootcamp',
    status: 'In progress',
    draft: true,
    stack: ['ROS2', 'MoveIt2', 'Doosan robot arm', 'PLC (LS PLC / XG5000 / MELSEC)', 'Python', 'Web interface'],
    problem:
      'Extending single-task arm control to a broader in-facility delivery and handling scenario by coordinating a Doosan robot arm, PLC-driven automation, and a mobile simulation layer through a web interface.',
    approach: [
      'Built calibration and gripper-control modules for precision handling.',
      'Implemented a PLC controller layer for physical automation alongside the robot-arm control stack.',
      'Built a web interface and a mobile simulation environment to test delivery / service scenarios ahead of physical deployment.',
    ],
    results: [
      'This latest project is still in active development — this card will be updated as results come in.',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/Filaner/RoToSY' }],
    video: {
      label: 'Watch demo',
      href: 'https://youtu.be/MdKExcUtkrw',
      embedId: 'MdKExcUtkrw',
    },
  },
]

export const otherProjects = [
  {
    title: 'BLUR',
    period: '2025',
    role: 'Team project · ML developer',
    desc: 'YOLOv11-based system that detects and blurs faces, license plates, QR codes, and sensitive text.',
  },
  {
    title: 'DOTS',
    period: '2024',
    role: 'Personal project',
    desc: 'Hyperparameter experiments for a CNN-based English Braille recognition model.',
  },
  {
    title: 'LLM Study',
    period: 'TRUST AI industry-academic program',
    role: 'Study group',
    desc: 'Experiments with MNLI, RAG, and prompt engineering.',
  },
  {
    title: 'GET OUT OF',
    period: '2024',
    role: 'Industry-academic project with Flash21',
    desc: 'Object-recognition engine for an AI-driven interactive installation.',
  },
]

export const awards = [
  {
    title: 'UCSD Qualcomm Institute AI Entrepreneurship Program',
    rank: '3rd place',
    year: '2025',
    desc: 'YOLOv11-based face / plate / QR / sensitive-text detection and blurring system (GCP, Jupyter, OpenCV, Python).',
  },
  {
    title: 'Bellevue College & COSSIM Project Group Microdegree Exhibition',
    rank: '1st place',
    year: '2025',
    desc: 'Walking-assistance app prototype developed using collected data and YOLOv5 detection (Flask, Python).',
  },
  {
    title: 'Bellevue College NextGen Startup Challenge (Hackathon)',
    rank: '2nd place',
    year: '2025',
    desc: 'Team Clover — VR escape room, "Space Needle" edition. Project planning and TPM role (React, Git, Unity, Firebase).',
  },
  {
    title: 'Daegu Digital Innovation Promotion Agency — Regional SW Talent Program',
    rank: '2nd place',
    year: '2024',
  },
  {
    title: 'Bellevue College Coding Competition',
    rank: '3rd place',
    year: '2025',
    desc: 'Algorithmic problem-solving in Python.',
  },
  {
    title: 'CO-Data Station Data Analysis Competition',
    rank: '4th place',
    year: '2024',
    desc: 'Proposed a regional industry-cluster analysis program using local industry data.',
  },
  {
    title: 'Korea Information Technology Society — Undergraduate Paper Competition',
    rank: '3rd place',
    year: '2024',
    desc: 'Location-based social app with AI character filtering — frontend development (Flutter, Jupyter Notebook).',
  },
]

export const skills = [
  { group: 'Languages', items: ['Python', 'C', 'Java', 'JavaScript', 'SQL'] },
  { group: 'ML / CV', items: ['PyTorch', 'TensorFlow', 'OpenCV', 'YOLO'] },
  { group: 'Robotics / Control', items: ['ROS2', 'MoveIt2', 'Doosan E0509', 'LS PLC', 'XG5000', 'MELSEC'] },
  { group: 'Web / Tools', items: ['React', 'Flutter', 'HTML', 'CSS', 'Firebase', 'GCP', 'Git', 'Figma'] },
]
