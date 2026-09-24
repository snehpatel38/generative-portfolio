import React, { useState, useEffect, useRef } from 'react';

// Component for the starfield background
const BackgroundAnimation = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        let animationFrameId;
        let renderer;
        let canvas;

        const initThreeJS = () => {
            const THREE = window.THREE;
            canvas = canvasRef.current;

            if (!canvas || canvas.getAttribute('data-initialized')) return;
            canvas.setAttribute('data-initialized', 'true');

            const mouse = { x: 0, y: 0 };

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
            camera.position.z = 70;

            renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);

            // Stars — stark white/amber, no soft nebula haze
            const starVertices = [];
            const starColors = [];
            for (let i = 0; i < 9000; i++) {
                starVertices.push(
                    THREE.MathUtils.randFloatSpread(3000),
                    THREE.MathUtils.randFloatSpread(3000),
                    THREE.MathUtils.randFloatSpread(3000)
                );
                const useAmber = Math.random() < 0.12;
                const color = useAmber
                    ? new THREE.Color(0xffb300)
                    : new THREE.Color().setHSL(0, 0, 0.85 + Math.random() * 0.15);
                starColors.push(color.r, color.g, color.b);
            }
            const starGeometry = new THREE.BufferGeometry();
            starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
            starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
            const starMaterial = new THREE.PointsMaterial({
                vertexColors: true,
                size: 1.6,
                sizeAttenuation: true,
                transparent: true,
                opacity: 1,
                depthWrite: false,
            });
            const stars = new THREE.Points(starGeometry, starMaterial);
            scene.add(stars);

            const handleMouseMove = (e) => {
                mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            };
            window.addEventListener('mousemove', handleMouseMove);

            const animate = () => {
                animationFrameId = requestAnimationFrame(animate);
                camera.position.x += (mouse.x * 3 - camera.position.x) * 0.05;
                camera.position.y += (mouse.y * 3 - camera.position.y) * 0.05;
                camera.lookAt(scene.position);
                stars.rotation.y -= 0.0002;
                renderer.render(scene, camera);
            };
            animate();

            const handleResize = () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setPixelRatio(window.devicePixelRatio);
            };
            window.addEventListener('resize', handleResize);
        };

        const scriptId = 'threejs-script';
        const existingScript = document.getElementById(scriptId);

        if (!existingScript) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
            script.async = true;
            script.onload = initThreeJS;
            script.onerror = () => console.error("Failed to load Three.js.");
            document.body.appendChild(script);
        } else if (window.THREE) {
            initThreeJS();
        } else {
            existingScript.addEventListener('load', initThreeJS);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (renderer) renderer.dispose();
            if (canvas) canvas.removeAttribute('data-initialized');
            const script = document.getElementById(scriptId);
            if (script) script.removeEventListener('load', initThreeJS);
        };
    }, []);

    return <canvas ref={canvasRef} id="bg-animation" className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />;
};

// Main App Component
export default function App() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const header = document.querySelector('header');
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav a.nav-link');
        document.body.style.backgroundColor = '#050507';

        const handleScroll = () => {
            header.classList.toggle('header-scrolled', window.scrollY > 30);
            let current = 'home';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 70) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(current)) {
                    link.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent background scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const SkillIcon = ({ src, alt }) => (
        <img
            src={src}
            alt={alt}
            title={alt}
            className="skill-icon"
            loading="lazy"
            onError={e => { e.currentTarget.style.display = 'none'; }}
        />
    );

    const skillIcons = {
        python: "https://cdn.simpleicons.org/python",
        cpp: "https://cdn.simpleicons.org/cplusplus",
        julia: "https://cdn.simpleicons.org/julia",
        sql: "https://cdn.simpleicons.org/mysql",
        react: "https://cdn.simpleicons.org/react",
        javascript: "https://cdn.simpleicons.org/javascript",
        html: "https://cdn.simpleicons.org/html5",
        css: "https://cdn.simpleicons.org/css3",
        spark: "https://cdn.simpleicons.org/apachespark",
        mysql: "https://cdn.simpleicons.org/mysql",
        sqlite: "https://cdn.simpleicons.org/sqlite",
        postgres: "https://cdn.simpleicons.org/postgresql",
        sklearn: "https://cdn.simpleicons.org/scikitlearn",
        pandas: "https://cdn.simpleicons.org/pandas",
        numpy: "https://cdn.simpleicons.org/numpy",
        matplotlib: "https://cdn.simpleicons.org/matplotlib",
        tensorflow: "https://cdn.simpleicons.org/tensorflow",
        pytorch: "https://cdn.simpleicons.org/pytorch",
        huggingface: "https://cdn.simpleicons.org/huggingface",
        langchain: "https://cdn.simpleicons.org/langchain",
        google: "https://cdn.simpleicons.org/googlegemini",
        openai: "https://cdn.simpleicons.org/openai",
        mistral: "https://cdn.simpleicons.org/mistralai",
        meta: "https://cdn.simpleicons.org/meta",
        kafka: "https://cdn.simpleicons.org/apachekafka",
        flink: "https://cdn.simpleicons.org/apacheflink",
        databricks: "https://cdn.simpleicons.org/databricks",
        delta: "https://cdn.simpleicons.org/delta",
        aws: "https://cdn.simpleicons.org/amazonwebservices",
        gcp: "https://cdn.simpleicons.org/googlecloud",
        azure: "https://cdn.simpleicons.org/microsoftazure",
        airflow: "https://cdn.simpleicons.org/apacheairflow",
        tableau: "https://cdn.simpleicons.org/tableau",
        powerbi: "https://cdn.simpleicons.org/powerbi",
        looker: "https://cdn.simpleicons.org/looker",
        docker: "https://cdn.simpleicons.org/docker",
        kubernetes: "https://cdn.simpleicons.org/kubernetes",
        terraform: "https://cdn.simpleicons.org/terraform",
        git: "https://cdn.simpleicons.org/git",
        github: "https://cdn.simpleicons.org/github",
        flask: "https://cdn.simpleicons.org/flask",
        fastapi: "https://cdn.simpleicons.org/fastapi",
        streamlit: "https://cdn.simpleicons.org/streamlit",
        onnx: "https://cdn.simpleicons.org/onnx",
        opencv: "https://cdn.simpleicons.org/opencv",
        matlab: "https://cdn.simpleicons.org/matlab",
        qgis: "https://cdn.simpleicons.org/qgis",
        arduino: "https://cdn.simpleicons.org/arduino",
        vscode: "https://cdn.simpleicons.org/visualstudiocode",
        anaconda: "https://cdn.simpleicons.org/anaconda",
        android: "https://cdn.simpleicons.org/android",
        grpc: "https://cdn.simpleicons.org/grpc",
        json: "https://cdn.simpleicons.org/json",
        yaml: "https://cdn.simpleicons.org/yaml",
        parquet: "https://cdn.simpleicons.org/apacheparquet",
        mongodb: "https://cdn.simpleicons.org/mongodb",
        qdrant: "https://cdn.simpleicons.org/qdrant",
        earthengine: "https://cdn.simpleicons.org/googleearthengine",
        dicom: "https://cdn.simpleicons.org/dicom",
    };

    const renderSkillIcons = (items) => (
        <div className="skill-icons">
            {items.map(([key, label]) => skillIcons[key] && (
                <SkillIcon key={`${key}-${label}`} src={skillIcons[key]} alt={label} />
            ))}
        </div>
    );

    const experienceData = [
        { company: "Smart Tech LLC", role: "AI Engineer", duration: "Oct 2025 — Present", points: ["Architected and implemented Azure-based data and AI workflows for clinical document processing, document understanding, clinical note generation, and workflow automation across healthcare use cases.", "Built a Natural Language-to-SQL Patient Referral system using Databricks SQL and Python, enabling natural-language analytics across 5K+ patient referral records and reducing manual data-querying effort by 60%.", "Developed a Clinical OCR Agent using Azure AI Document Intelligence, Python, and LLM-based extraction, processing 2K+ medical reports and improving structured information extraction accuracy from 78% to 94%.", "Built a Clinical Speech-to-Text Agent using OpenAI Whisper, processing 1,000+ hours of clinical audio and integrating transcription with downstream NLP, summarization, and clinical note-generation workflows.", "Implemented PII/PHI Detection and De-identification pipelines across 5K+ healthcare records, supporting HIPAA-aware data processing and controlled downstream access.", "Engineered hybrid retrieval pipelines to optimize RAG — improved Agentic RAG performance (BM25 + Embeddings, Qdrant Vector Database) with 10× faster ingestion and 55% token cost reduction via context-preserving chunking.", "Engineered a \"Trust Engine\" using LLM-as-a-judge to score accuracy, hallucination, and relevance, automatically boosting production agents' average accuracy from 70% to 93%.", "Enabled enterprise-aware context via vector indexing and dynamic business terminology grounding (e.g., \"Rx\" = Prescription, not restaurant), powering 3+ agents with consistent definitions."] },
        { company: "Environomics Projects LLP", role: "Software Developer Intern", duration: "Jan 2025 — Apr 2025", points: ["Engineered AWS-based data pipelines using Amazon S3, AWS Lambda, and AWS Glue to ingest and transform 200K+ records from 4+ data sources, including real-time weather, solar generation, inverter telemetry, and energy-production data.", "Built time-series forecasting and anomaly-detection pipelines for 50K+ energy and inverter observations.", "Developed Tableau dashboards for real-time inverter monitoring, energy-yield tracking, operational performance, and KPI visualization."] },
        { company: "Innomatics Research Labs", role: "Data Science Intern", duration: "Sep 2024 — Dec 2024", points: ["Built an AI-powered code reviewer for automated feedback.", "Authored Medium articles on NLP and search engine design.", "Designed ML models for diamond price prediction."] },
        { company: "IBM SkillsBuild", role: "AI/ML Intern", duration: "Jul 2024 — Aug 2024", points: ["Built a kidney stone prediction model with 81% accuracy.", "Designed a chatbot with WatsonX Assistant for eco-friendly choices."] },
        { company: "Infolabz IT Services", role: "Data Analysis and ML Intern", duration: "Jun 2024 — Jul 2024", points: ["Designed ETL pipelines with Python to transform API data.", "Built a house price prediction app using Streamlit.", "Trained a CNN to classify images of tablets and laptops."] }
    ];

    const certifications = [
        {
            title: "Databricks Certified Machine Learning Professional",
            issuer: "DATABRICKS",
            link: "https://credentials.databricks.com/3064c4c6-e5dc-4aa7-801b-e71870f04d17#acc.tC4LQ0eJ"
        },
        {
            title: "Databricks Certified Machine Learning Associate",
            issuer: "DATABRICKS",
            link: "https://credentials.databricks.com/1baa64c2-ef45-448b-b99b-d5caca49420f#acc.TjRDNs3S"
        },
        {
            title: "Machine Learning Specialization",
            issuer: "DEEPLEARNING.AI",
            link: "https://coursera.org/share/1150f7300cfc626d0edf64f246b00709"
        }
    ];

    const blogData = [
        { title: "Evolution of Language Representation Techniques", desc: "A journey from Bag-of-Words and TF-IDF to advanced models like BERT and GPT.", link: "https://medium.com/@snehpatel0308/evolution-of-language-representation-techniques-a-journey-from-bow-to-gpt-99707199ef27" },
        { title: "Hacking System Design: How Search Engines Work", desc: "Demystifying how search engines rank, retrieve, and understand queries.", link: "https://medium.com/@snehpatel0308/hacking-the-system-design-how-search-engines-understand-and-deliver-results-83cf6a469628" }
    ];

    const projects = [
        {
            title: "Patient Referral Management System",
            company: "Smart Tech LLC",
            status: "COMPLETED",
            desc: "Built an AI-powered healthcare referral platform that automates SMS/MMS referral intake, OCR-based document extraction, referral validation, and clinic-to-clinic routing. Developed FastAPI backend services with asynchronous processing and integrated Twilio for real-time referral communication, alongside a React Native admin application for clinic/contact management and referral tracking. Created an OCR Agent using Databricks Agent Framework and designed a Medallion Architecture (Bronze → Silver → Gold) to process, standardize, validate, and serve referral data.",
            tech: ["Databricks", "Databricks Agent Framework", "Medallion Architecture", "FastAPI", "Python", "Twilio", "React Native", "OCR"],
            link: "#experience"
        },
        { title: "Infrastructure Change Detection", desc: "A Siamese U-Net model to detect changes in satellite imagery, achieving 97.3% accuracy.", tech: ["PyTorch", "Albumentations"], link: "https://www.kaggle.com/code/snehpatel3/intrastructure-cd" },
        { title: "3D Brain Tumor Segmentation", desc: "Developed a 3D U-Net for MRI scan segmentation, achieving 96% validation accuracy.", tech: ["TensorFlow", "Keras", "Nibabel"], link: "https://snehpatel38.github.io/BraTS_segmentation_Using_3D_UNet/" },
        { title: "MediLex: AI Medical Assistant", desc: "A RAG system for medical document Q&A using LangChain and Llama models.", tech: ["LangChain", "Streamlit", "FAISS"], link: "https://github.com/snehpatel38/MediLex" },
        { title: "Workout Recommendation System", desc: "A content-based filtering system to provide personalized workout suggestions.", tech: ["Flask", "Scikit-learn", "Docker"], link: "https://snehpatel38.github.io/workout_recommendation_system/" }
    ];

    return (
        <>
            <style>{`
                :root {
                    --void: #050507;
                    --panel: #0D0D12;
                    --ink: #F2F1EA;
                    --amber: #FFB300;
                    --red: #FF3B30;
                    --white: #FFFFFF;
                    --section-padding-y: 7rem;
                    --container-padding: 1.25rem;
                    --border: 2px solid var(--white);
                }

                @media (min-width: 640px) { :root { --container-padding: 3rem; } }
                @media (min-width: 1024px) { :root { --container-padding: 4rem; } }
                @media (max-width: 480px) { :root { --section-padding-y: 5rem; } }

                * { box-sizing: border-box; }

                html { scroll-behavior: smooth; }

                /* Fallback so text stays visible even if Tailwind's
                   arbitrary-value classes (text-[#...]) aren't compiled */
                body {
                    color: var(--ink);
                }
                a { color: inherit; text-decoration: none; }

                body {
                    background-color: var(--void);
                    background-image:
                        linear-gradient(rgba(242,241,234,0.06) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(242,241,234,0.06) 1px, transparent 1px);
                    background-size: 48px 48px;
                    background-position: -1px -1px;
                    opacity: 1;
                }
                .vignette {
                    background:
                        radial-gradient(ellipse at 50% 0%, rgba(255,179,0,0.06), transparent 55%),
                        radial-gradient(ellipse at 50% 100%, transparent 45%, rgba(0,0,0,0.92) 100%),
                        radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%);
                }
                body::before { content: none; }

                .container {
                    max-width: 1180px;
                    margin-left: auto;
                    margin-right: auto;
                    padding-left: var(--container-padding);
                    padding-right: var(--container-padding);
                }

                section { padding-top: var(--section-padding-y); padding-bottom: var(--section-padding-y); }

                h1, h2, h3, h4, .display {
                    font-family: 'Space Grotesk', 'Arial Black', Helvetica, sans-serif;
                    letter-spacing: -0.02em;
                }

                body, p, li, a, span, div {
                    font-family: 'Inter', Helvetica, Arial, sans-serif;
                }

                .mono {
                    font-family: 'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace;
                }

                /* Header */
                header {
                    background: var(--void);
                    border-bottom: var(--border);
                }
                header.header-scrolled { background: var(--void); }

                .brand-mark {
                    background: var(--ink);
                    color: var(--void);
                    padding: 0.35rem 0.6rem;
                }

                .nav-link {
                    position: relative;
                    color: var(--ink);
                    text-decoration: none;
                    padding-bottom: 2px;
                    border-bottom: 2px solid transparent;
                }
                .nav-link:hover, .nav-link.active {
                    border-bottom: 2px solid var(--red);
                }

                .icon-btn {
                    border: 2px solid var(--ink);
                    color: var(--ink);
                    background: var(--void);
                    padding: 0.4rem;
                    display: inline-flex;
                    transition: transform 0.12s ease;
                }
                .icon-btn:hover {
                    background: var(--ink);
                    color: var(--void);
                    transform: translate(-2px, -2px);
                    box-shadow: 3px 3px 0 var(--red);
                }

                .burger-btn {
                    border: 2px solid var(--ink);
                    background: var(--void);
                    padding: 0.4rem 0.6rem;
                }

                /* Mobile Menu */
                .mobile-menu-bg {
                    background: var(--void) !important;
                    opacity: 1;
                }
                .mobile-menu { padding-top: 4rem; }
                .mobile-menu-close {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    font-size: 1.5rem;
                    color: var(--ink);
                    background: none;
                    border: 2px solid var(--ink);
                    cursor: pointer;
                    padding: 0.3rem 0.6rem;
                }
                .mobile-menu-item {
                    color: var(--ink) !important;
                    border-bottom: 2px solid rgba(242,241,234,0.2);
                }
                .mobile-menu-item:hover { background: var(--red) !important; color: var(--void) !important; }

                /* Hero */
                .hero-tag {
                    display: inline-block;
                    background: var(--ink);
                    color: var(--void);
                    padding: 0.3rem 0.75rem;
                }
                .hero-title {
                    font-size: clamp(3rem, 12vw, 8rem);
                    line-height: 0.92;
                    font-weight: 800;
                    color: var(--ink);
                }
                .hero-subtitle {
                    font-size: clamp(1.25rem, 4vw, 2.25rem);
                    color: var(--void);
                    background: var(--ink);
                    display: inline-block;
                    padding: 0.25rem 0.6rem;
                    font-weight: 700;
                }
                .hero-rule { border-top: var(--border); }

                /* Section titles */
                .section-title {
                    font-size: clamp(1.75rem, 4vw, 2.5rem);
                    font-weight: 800;
                    color: var(--ink);
                    display: flex;
                    align-items: baseline;
                    gap: 0.75rem;
                }
                .section-title::before {
                    content: attr(data-index);
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 1rem;
                    color: var(--amber);
                }

                /* Bordered box / hard shadow utility */
                .box {
                    background: var(--panel);
                    border: var(--border);
                    box-shadow: 8px 8px 0 var(--amber);
                }

                /* Hero status strip */
                .status-strip {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem 1.5rem;
                    border: 2px solid rgba(242,241,234,0.35);
                    padding: 0.85rem 1.1rem;
                }
                .status-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.78rem;
                    color: var(--ink);
                    opacity: 0.85;
                }
                .status-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: var(--amber);
                    flex-shrink: 0;
                }
                .status-dot.online {
                    background: var(--red);
                    animation: expPulse 1.6s ease-in-out infinite;
                }

                /* Experience — mission log cards */
                .exp-list { display: flex; flex-direction: column; gap: 1.5rem; }
                .exp-card {
                    background: var(--panel);
                    border: var(--border);
                    box-shadow: 6px 6px 0 var(--amber);
                    padding: 1.75rem;
                    transition: transform 0.12s ease, box-shadow 0.12s ease;
                }
                .exp-card:hover {
                    transform: translate(-4px, -4px);
                    box-shadow: 10px 10px 0 var(--red);
                }
                .exp-head {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 1rem;
                    flex-wrap: wrap;
                    border-bottom: 2px solid rgba(242,241,234,0.2);
                    padding-bottom: 1.1rem;
                    margin-bottom: 1.1rem;
                }
                .exp-index {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--amber);
                    margin-right: 0.75rem;
                }
                .exp-role { color: var(--ink); }
                .exp-company {
                    font-family: 'JetBrains Mono', monospace;
                    color: var(--amber);
                    font-size: 0.9rem;
                    margin-top: 0.25rem;
                }
                .exp-meta { text-align: right; }
                .exp-duration {
                    font-family: 'JetBrains Mono', monospace;
                    color: var(--ink);
                    opacity: 0.75;
                    font-size: 0.8rem;
                }
                .exp-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.7rem;
                    color: var(--red);
                    border: 2px solid var(--red);
                    padding: 0.15rem 0.5rem;
                    margin-top: 0.4rem;
                }
                .exp-badge-dot {
                    width: 6px;
                    height: 6px;
                    background: var(--red);
                    border-radius: 50%;
                    animation: expPulse 1.6s ease-in-out infinite;
                }
                @keyframes expPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.25; }
                }
                .exp-points {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    display: grid;
                    gap: 0.55rem;
                }
                .exp-points li {
                    color: var(--ink);
                    padding-left: 1.4rem;
                    position: relative;
                }
                .exp-points li::before {
                    content: '›';
                    position: absolute;
                    left: 0;
                    color: var(--amber);
                    font-family: 'JetBrains Mono', monospace;
                    font-weight: 700;
                }

                /* Project Cards */
                .project-card {
                    background: var(--panel);
                    border: var(--border);
                    transition: transform 0.12s ease, box-shadow 0.12s ease;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 6px 6px 0 var(--amber);
                }
                .project-card:hover {
                    transform: translate(-4px, -4px);
                    box-shadow: 10px 10px 0 var(--red);
                }
                .tech-tag {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.72rem;
                    border: 2px solid var(--ink);
                    padding: 0.15rem 0.5rem;
                    color: var(--ink);
                }
                .project-index {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.75rem;
                    color: var(--amber);
                    letter-spacing: 0.04em;
                    margin-bottom: 0.6rem;
                    display: block;
                }
                .view-btn {
                    border: 2px solid var(--ink);
                    color: var(--ink);
                    background: var(--void);
                    font-weight: 700;
                    transition: all 0.12s ease;
                }
                .view-btn:hover { background: var(--ink); color: var(--void); }

                /* Skills Grid */
                .skills-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1.5rem;
                }
                @media (max-width: 640px) { .skills-grid { grid-template-columns: 1fr; } }

                .skill-category {
                    background: var(--panel);
                    border: var(--border);
                    padding: 1.5rem;
                    transition: background 0.12s ease, color 0.12s ease;
                }
                .skill-category:hover { background: var(--ink); }
                .skill-category:hover .skill-cat-label,
                .skill-category:hover .skill-cat-body { color: var(--void); }
                .skill-cat-label {
                    font-family: 'JetBrains Mono', monospace;
                    font-weight: 700;
                    text-transform: none;
                    color: var(--amber);
                }
                .skill-cat-body { color: var(--ink); font-size: 0.9rem; }

                .skill-icons { display: flex; flex-wrap: wrap; gap: 0.6rem; margin: 1rem 0; }
                .skill-icon { width: 28px; height: 28px; }

                /* Certifications */
                .cert-grid {
                    display: grid;
                    gap: 1.5rem;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                }
                @media (max-width: 640px) { .cert-grid { grid-template-columns: 1fr; } }
                .cert-card {
                    background: var(--panel);
                    border: var(--border);
                    box-shadow: 6px 6px 0 var(--amber);
                    padding: 1.5rem;
                    transition: transform 0.12s ease, box-shadow 0.12s ease;
                }
                .cert-card:hover {
                    transform: translate(-4px, -4px);
                    box-shadow: 10px 10px 0 var(--red);
                }
                .cert-issuer {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.75rem;
                    color: var(--amber);
                    letter-spacing: 0.04em;
                    margin-bottom: 0.5rem;
                    display: block;
                }
                .cert-link {
                    color: var(--ink);
                    text-decoration: none;
                    border-bottom: 2px solid transparent;
                    transition: color 0.12s ease, border-color 0.12s ease;
                }
                .cert-link:hover {
                    color: var(--amber);
                    border-bottom-color: var(--red);
                }

                /* Blog */
                .blog-grid {
                    display: grid;
                    gap: 1.5rem;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    max-width: 820px;
                    margin: 0 auto;
                }
                @media (max-width: 640px) { .blog-grid { grid-template-columns: 1fr; } }

                /* Contact */
                .say-hello-btn {
                    display: inline-block;
                    background: var(--red);
                    color: var(--white);
                    font-weight: 800;
                    padding: 1rem 2.5rem;
                    border: var(--border);
                    box-shadow: 8px 8px 0 var(--amber);
                    transition: transform 0.1s ease, box-shadow 0.1s ease;
                    text-decoration: none;
                }
                .say-hello-btn:hover {
                    transform: translate(4px, 4px);
                    box-shadow: 0 0 0 var(--amber);
                }

                footer { border-top: var(--border); background: var(--void); }

                /* Responsive spacing */
                .responsive-spacing { padding: clamp(1rem, 4vw, 2rem); }

                @media (max-width: 768px) {
                    .mobile-menu-item { padding: 1rem 1.5rem; }
                }
            `}</style>

            <BackgroundAnimation />
            <div className="vignette fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}></div>

            <div className="relative min-h-screen" style={{ zIndex: 1 }}>
                <header className="fixed top-0 left-0 right-0 z-50 py-3 md:py-4">
                    <div className="container flex justify-between items-center">
                        <a href="#home" className="brand-mark text-lg md:text-xl font-bold tracking-tight">Sneh Patel</a>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 mono">
                            <a href="#about" className="nav-link text-sm lg:text-base font-semibold">About</a>
                            <a href="#experience" className="nav-link text-sm lg:text-base font-semibold">Experience</a>
                            <a href="#skills" className="nav-link text-sm lg:text-base font-semibold">Skills</a>
                            <a href="#certifications" className="nav-link text-sm lg:text-base font-semibold">Certs</a>
                            <a href="#projects" className="nav-link text-sm lg:text-base font-semibold">Projects</a>
                            <a href="#blog" className="nav-link text-sm lg:text-base font-semibold">Blog</a>
                        </nav>

                        {/* Desktop Social Links */}
                        <div className="hidden md:flex items-center space-x-3">
                            <a href="https://linkedin.com/in/snehpatel38" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="icon-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20" fill="currentColor" style={{ display: 'block' }}>
                                    <path d="M27 0H5C2.2 0 0 2.2 0 5v22c0 2.8 2.2 5 5 5h22c2.8 0 5-2.2 5-5V5c0-2.8-2.2-5-5-5zM9.4 27H5.7V12h3.7v15zm-1.9-17.1c-1.2 0-2.1-1-2.1-2.1 0-1.2 1-2.1 2.1-2.1 1.2 0 2.1 1 2.1 2.1 0 1.2-1 2.1-2.1 2.1zm19.5 17.1h-3.7v-7.3c0-1.7-0.6-2.8-2.1-2.8-1.1 0-1.7 0.7-2 1.4-0.1 0.3-0.1 0.7-0.1 1.1V27h-3.7s0-13.7 0-15h3.7v2.1c0.5-0.8 1.4-2.1 3.5-2.1 2.6 0 4.5 1.7 4.5 5.3V27z" />
                                </svg>
                            </a>
                            <a href="https://github.com/snehpatel38" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="icon-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.68 7.68 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.45.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                                </svg>
                            </a>
                        </div>

                        {/* Mobile Menu Button */}
                        <button onClick={toggleMobileMenu} className="burger-btn md:hidden">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden fixed inset-0 mobile-menu-bg z-50">
                            <div className="mobile-menu">
                                <button onClick={closeMobileMenu} className="mobile-menu-close">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div className="flex flex-col mono">
                                    <a href="#about" onClick={closeMobileMenu} className="mobile-menu-item text-lg transition-colors">About</a>
                                    <a href="#experience" onClick={closeMobileMenu} className="mobile-menu-item text-lg transition-colors">Experience</a>
                                    <a href="#skills" onClick={closeMobileMenu} className="mobile-menu-item text-lg transition-colors">Skills</a>
                                    <a href="#certifications" onClick={closeMobileMenu} className="mobile-menu-item text-lg transition-colors">Certifications</a>
                                    <a href="#projects" onClick={closeMobileMenu} className="mobile-menu-item text-lg transition-colors">Projects</a>
                                    <a href="#blog" onClick={closeMobileMenu} className="mobile-menu-item text-lg transition-colors">Blog</a>
                                    <a href="#resume" onClick={closeMobileMenu} className="mobile-menu-item text-lg transition-colors">Contact</a>
                                </div>

                                {/* Mobile Social Links */}
                                <div className="flex space-x-4 mt-8 px-6">
                                    <a href="https://linkedin.com/in/snehpatel38" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="icon-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M0 1.146C0 .513.324 0 .725 0h14.55c.4 0 .725.513.725 1.146v13.708c0 .633-.324 1.146-.725 1.146H.725A.723.723 0 0 1 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.21c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.341-1.248-.822 0-1.358.54-1.358 1.248 0 .694.521 1.248 1.326 1.248h.015zm4.908 8.21h2.4V9.359c0-.215.015-.43.08-.586.176-.43.576-.876 1.247-.876.88 0 1.233.66 1.233 1.63v4.867h2.4V9.19c0-2.22-1.184-3.252-2.764-3.252-1.273 0-1.845.7-2.165 1.19h.015v-1.02h-2.4c.03.66 0 7.225 0 7.225z" />
                                        </svg>
                                    </a>
                                    <a href="https://github.com/snehpatel38" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="icon-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.68 7.68 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.45.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </header>

                <main>
                    {/* Hero Section */}
                    <section id="home" className="min-h-screen flex flex-col justify-center responsive-spacing">
                        <div className="container">
                            <p className="mono hero-tag text-sm md:text-base mb-6">HI, I'M —</p>
                            <h1 className="hero-title mb-4">Sneh Patel.</h1>
                            <p className="hero-subtitle mb-8">AI and Data Engineer</p>
                            <div className="hero-rule pt-6 max-w-3xl">
                                <p className="text-base md:text-lg text-[#F2F1EA] leading-relaxed">
                                    Detail-oriented AI + Data Engineer building scalable agentic AI platforms, RAG architectures, LLM evaluation frameworks, and data engineering ecosystems across AWS, Azure, and GCP. I partner with software architects to turn business requirements into data products that drive efficiency and cost savings.
                                </p>
                            </div>
                            <div className="status-strip mono mt-6 max-w-3xl">
                                <span className="status-item"><span className="status-dot online"></span>Open to opportunities</span>
                                <span className="status-item"><span className="status-dot"></span>Ahmedabad, India</span>
                                <span className="status-item"><span className="status-dot"></span>Focus: Agentic AI & Data Engineering</span>
                            </div>
                            <div className="flex items-center gap-3 mt-8">
                                <a href="https://github.com/snehpatel38" target="_blank" rel="noopener noreferrer" className="icon-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.68 7.68 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.45.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                                    </svg>
                                </a>
                                <a href="https://linkedin.com/in/snehpatel38" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="icon-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20" fill="currentColor" style={{ display: 'block' }}>
                                        <path d="M27 0H5C2.2 0 0 2.2 0 5v22c0 2.8 2.2 5 5 5h22c2.8 0 5-2.2 5-5V5c0-2.8-2.2-5-5-5zM9.4 27H5.7V12h3.7v15zm-1.9-17.1c-1.2 0-2.1-1-2.1-2.1 0-1.2 1-2.1 2.1-2.1 1.2 0 2.1 1 2.1 2.1 0 1.2-1 2.1-2.1 2.1zm19.5 17.1h-3.7v-7.3c0-1.7-0.6-2.8-2.1-2.8-1.1 0-1.7 0.7-2 1.4-0.1 0.3-0.1 0.7-0.1 1.1V27h-3.7s0-13.7 0-15h3.7v2.1c0.5-0.8 1.4-2.1 3.5-2.1 2.6 0 4.5 1.7 4.5 5.3V27z" />
                                    </svg>
                                </a>
                                <a href="mailto:snehpatel0308@gmail.com" className="icon-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </section>

                    <div className="container">
                        {/* About Section */}
                        <section id="about">
                            <h2 className="section-title mb-8" data-index="01">Education</h2>
                            <div className="box p-5 md:p-7">
                                <h3 className="text-xl md:text-2xl font-bold text-[#F2F1EA] mb-2">Gujarat Technological University</h3>
                                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-4 gap-y-1 items-start sm:items-center mb-4 mono text-sm">
                                    <span className="text-[#FFB300] font-semibold">Ahmedabad, India</span>
                                    <span className="text-[#F2F1EA]">BE — Computer Engineering</span>
                                    <span className="text-[#FF3B30] font-semibold">CGPA: 9.02/10.00</span>
                                </div>
                                <ul className="list-disc list-inside text-[#F2F1EA] space-y-2 text-sm md:text-base">
                                    <li>Presented a review paper on a team project titled <span className="font-semibold">'Image Encryption and Decryption'</span></li>
                                    <li>Won <span className="font-semibold">1st prize</span> in an inter-college tech competition</li>
                                </ul>
                            </div>
                        </section>

                        {/* Experience Section */}
                        <section id="experience">
                            <h2 className="section-title mb-8 md:mb-10" data-index="02">Professional Experience</h2>
                            <div className="exp-list">
                                {experienceData.map((exp, idx) => {
                                    const isCurrent = exp.duration.includes('Present');
                                    return (
                                        <div key={exp.company + idx} className="exp-card">
                                            <div className="exp-head">
                                                <div>
                                                    <h3 className="text-lg md:text-xl font-bold exp-role">
                                                        <span className="exp-index">{String(idx + 1).padStart(2, '0')}</span>
                                                        {exp.role}
                                                    </h3>
                                                    <p className="exp-company">{exp.company}</p>
                                                </div>
                                                <div className="exp-meta">
                                                    <p className="exp-duration">{exp.duration}</p>
                                                    {isCurrent && (
                                                        <span className="exp-badge">
                                                            <span className="exp-badge-dot"></span>
                                                            Active
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <ul className="exp-points text-sm md:text-base">
                                                {exp.points.map((point, i) => <li key={exp.company + '-' + i}>{point}</li>)}
                                            </ul>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Skills Section */}
                        <section id="skills">
                            <div className="max-w-6xl mx-auto">
                                <h2 className="section-title mb-8 md:mb-10" data-index="03">Skills</h2>
                                <div className="skills-grid">
                                    <div className="skill-category">
                                        <div className="skill-cat-label mb-4">Languages</div>
                                        {renderSkillIcons([
                                            ["python","Python"], ["cpp","C/C++"], ["julia","Julia"],
                                            ["sql","SQL"], ["spark","PySpark / Spark"], ["react","React"],
                                            ["javascript","JavaScript"], ["html","HTML"], ["css","CSS"]
                                        ])}
                                        <div className="skill-cat-body">Python, SQL, Spark/PySpark, C/C++, Julia, React, JavaScript, HTML/CSS</div>
                                    </div>

                                    <div className="skill-category">
                                        <div className="skill-cat-label mb-4">Databases</div>
                                        {renderSkillIcons([
                                            ["mysql","MySQL"], ["sqlite","SQLite"], ["postgres","PostgreSQL"], ["mongodb","MongoDB"]
                                        ])}
                                        <div className="skill-cat-body">MySQL, SQLite, PostgreSQL</div>
                                    </div>

                                    <div className="skill-category">
                                        <div className="skill-cat-label mb-4">Machine Learning</div>
                                        {renderSkillIcons([
                                            ["sklearn","Scikit-learn"], ["pandas","Pandas"], ["numpy","NumPy"], ["matplotlib","Matplotlib"]
                                        ])}
                                        <div className="skill-cat-body">Regression, Classification, Clustering, NLP, Time Series Forecasting, Hyperparameter Tuning, Model Evaluation</div>
                                    </div>

                                    <div className="skill-category">
                                        <div className="skill-cat-label mb-4">Deep Learning</div>
                                        {renderSkillIcons([
                                            ["tensorflow","TensorFlow"], ["pytorch","PyTorch"]
                                        ])}
                                        <div className="skill-cat-body">ANN, CNN, RNN, LSTM, GRU, Transformers, BERT, GPT, Transfer Learning</div>
                                    </div>

                                    <div className="skill-category">
                                        <div className="skill-cat-label mb-4">Generative AI & Agents</div>
                                        {renderSkillIcons([
                                            ["openai","OpenAI"], ["google","Gemini"], ["huggingface","Hugging Face"],
                                            ["langchain","LangChain"], ["mistral","Mistral"], ["meta","LLaMA"],
                                            ["qdrant","Qdrant"]
                                        ])}
                                        <div className="skill-cat-body">OpenAI & Gemini APIs, LangChain, LangGraph, MCP, A2A, RAG & Agentic RAG, LLM-as-a-Judge, Prompt Engineering, Vector Databases (Qdrant), Sparse-Dense Embeddings</div>
                                    </div>

                                    <div className="skill-category">
                                        <div className="skill-cat-label mb-4">Data Engineering & Distributed Computing</div>
                                        {renderSkillIcons([
                                            ["python","Python"], ["spark","Apache Spark"], ["kafka","Kafka"], ["flink","Apache Flink"]
                                        ])}
                                        <div className="skill-cat-body">Apache Spark, PySpark, Apache Flink, ETL/ELT, Data Pipelines, Data Quality</div>
                                    </div>

                                    <div className="skill-category">
                                        <div className="skill-cat-label mb-4">Data Lakehouse & Warehousing</div>
                                        {renderSkillIcons([
                                            ["databricks","Databricks"], ["delta","Delta Lake"], ["aws","Amazon Redshift"], ["gcp","BigQuery"]
                                        ])}
                                        <div className="skill-cat-body">Redshift, BigQuery, Databricks, Delta Lake, Data Mesh</div>
                                    </div>

                                    <div className="skill-category">
                                        <div className="skill-cat-label mb-4">Orchestration & Visualization</div>
                                        {renderSkillIcons([
                                            ["airflow","Airflow"], ["tableau","Tableau"], ["powerbi","Power BI"], ["looker","Looker"]
                                        ])}
                                        <div className="skill-cat-body">Airflow, Control-M, Talend · Tableau, Power BI, Looker, Sigma Computing, ThoughtSpot</div>
                                    </div>

                                    <div className="skill-category">
                                        <div className="skill-cat-label mb-4">Cloud & DevOps</div>
                                        {renderSkillIcons([
                                            ["aws","AWS"], ["azure","Azure"], ["gcp","GCP"], ["git","Git"],
                                            ["docker","Docker"], ["kubernetes","Kubernetes"], ["terraform","Terraform"]
                                        ])}
                                        <div className="skill-cat-body">AWS, Azure, GCP, Git, CI/CD, Terraform, Docker, Kubernetes</div>
                                    </div>

                                    <div className="skill-category">
                                        <div className="skill-cat-label mb-4">Formats & Interfaces</div>
                                        {renderSkillIcons([
                                            ["grpc","gRPC"], ["json","JSON"], ["yaml","YAML"], ["parquet","Parquet"], ["delta","Delta Lake"]
                                        ])}
                                        <div className="skill-cat-body">gRPC, REST APIs, Parquet, Iceberg, Delta, JSON, YAML</div>
                                    </div>

                                    <div className="skill-category">
                                        <div className="skill-cat-label mb-4">Development</div>
                                        {renderSkillIcons([
                                            ["flask","Flask"], ["fastapi","FastAPI"], ["streamlit","Streamlit"],
                                            ["onnx","ONNX"], ["vscode","VS Code"], ["git","Git"]
                                        ])}
                                        <div className="skill-cat-body">Flask, FastAPI, Streamlit, ONNX</div>
                                    </div>

                                    <div className="skill-category">
                                        <div className="skill-cat-label mb-4">Computer Vision</div>
                                        {renderSkillIcons([
                                            ["opencv","OpenCV"], ["pytorch","PyTorch"], ["matlab","MATLAB"]
                                        ])}
                                        <div className="skill-cat-body">OpenCV, Scikit-Image, Matlab, YOLO</div>
                                    </div>

                                    <div className="skill-category">
                                        <div className="skill-cat-label mb-4">Tools & Platforms</div>
                                        {renderSkillIcons([
                                            ["git","Git"], ["docker","Docker"], ["vscode","VS Code"], ["anaconda","Anaconda"],
                                            ["arduino","Arduino IDE"], ["android","Android Studio"]
                                        ])}
                                        <div className="skill-cat-body">Git, Docker, Jupyter Notebook, VS Code, Anaconda, Spyder, Arduino IDE</div>
                                    </div>

                                    <div className="skill-category">
                                        <div className="skill-cat-label mb-4">Medical Imaging</div>
                                        {renderSkillIcons([
                                            ["pytorch","PyTorch / MONAI"], ["dicom","DICOM / PyDicom"], ["numpy","NiBabel / NumPy"]
                                        ])}
                                        <div className="skill-cat-body">NiBabel, PyDicom, 3D Slicer, MONAI (beginner)</div>
                                    </div>

                                    <div className="skill-category">
                                        <div className="skill-cat-label mb-4">Geospatial & Remote Sensing</div>
                                        {renderSkillIcons([
                                            ["earthengine","Google Earth Engine"], ["qgis","QGIS"]
                                        ])}
                                        <div className="skill-cat-body">Google Earth Engine, QGIS (beginner)</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Certifications Section */}
                        <section id="certifications">
                            <h2 className="section-title mb-8 md:mb-10" data-index="04">Certifications</h2>
                            <div className="cert-grid">
                                {certifications.map((cert, idx) => (
                                    <div key={cert.title + idx} className="cert-card">
                                        <span className="cert-issuer">{cert.issuer}</span>
                                        <h3 className="text-lg md:text-xl font-bold text-[#F2F1EA]">
                                            <a
                                                href={cert.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="cert-link"
                                                aria-label={`View ${cert.title}`}
                                            >
                                                {cert.title} ↗
                                            </a>
                                        </h3>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Projects Section */}
                        <section id="projects">
                            <h2 className="section-title mb-8 md:mb-10" data-index="05">Featured Projects</h2>
                            <div className="projects-grid" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                                {projects.map((p, idx) => (
                                    <div key={p.title + idx} className="project-card p-5 md:p-6">
                                        <span className="project-index">PROJECT_{String(idx + 1).padStart(2, '0')}</span>
                                        <div className="flex items-center justify-between gap-3 mb-2">
                                            <h3 className="text-lg md:text-xl font-bold text-[#F2F1EA]">{p.title}</h3>
                                            {p.status && <span className="exp-badge" style={{ marginTop: 0 }}>{p.status}</span>}
                                        </div>
                                        {p.company && <p className="exp-company mb-3">{p.company}</p>}
                                        <p className="text-[#F2F1EA] flex-grow text-sm md:text-base mb-4">{p.desc}</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {p.tech.map((t, i) => (
                                                <span key={p.title + '-' + t + '-' + i} className="tech-tag">{t}</span>
                                            ))}
                                        </div>
                                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="view-btn inline-block mt-auto px-4 py-2 text-sm text-center w-full md:w-auto">
                                            View project
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Blog Section */}
                        <section id="blog">
                            <h2 className="section-title mb-8 md:mb-10" data-index="06">Blog Articles</h2>
                            <div className="blog-grid">
                                {blogData.map((post, idx) => (
                                    <a href={post.link} target="_blank" rel="noopener noreferrer" key={post.title + idx} className="project-card block p-5 md:p-6">
                                        <h3 className="text-lg md:text-xl font-bold text-[#F2F1EA] mb-3">{post.title}</h3>
                                        <p className="text-[#F2F1EA] text-sm md:text-base">{post.desc}</p>
                                    </a>
                                ))}
                            </div>
                        </section>

                        {/* Contact Section */}
                        <section id="resume">
                            <h2 className="section-title mb-6" data-index="07">Get in touch</h2>
                            <p className="text-base md:text-lg text-[#F2F1EA] mb-8 max-w-2xl leading-relaxed">
                                My inbox is always open. Whether you have a question or just want to say hi, I'll do my best to get back to you.
                            </p>
                            <a
                                href="mailto:snehpatel0308@gmail.com"
                                className="say-hello-btn mono text-base md:text-lg"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Say hello →
                            </a>
                        </section>
                    </div>
                </main>

                <footer className="py-6 md:py-8 mt-8 md:mt-10">
                    <div className="container">
                        <p className="mono text-sm md:text-base text-[#F2F1EA]">Designed & built by Sneh Patel</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
