import React, { useState, useEffect, useRef } from 'react';

// --- Components ---

// Component for the 3D background animation
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

            renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                alpha: true,
                antialias: true,
            });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);

            // Starfield
            const starVertices = [];
            for (let i = 0; i < 40000; i++) {
                const x = THREE.MathUtils.randFloatSpread(3000);
                const y = THREE.MathUtils.randFloatSpread(3000);
                const z = THREE.MathUtils.randFloatSpread(3000);
                starVertices.push(x, y, z);
            }
            const starGeometry = new THREE.BufferGeometry();
            starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
            const starMaterial = new THREE.PointsMaterial({ color: 0x6c757d, size: 0.25 });
            const stars = new THREE.Points(starGeometry, starMaterial);
            scene.add(stars);

            // Nebula/Galaxy Dust
            const dustVertices = [];
            for (let i = 0; i < 20000; i++) {
                const x = THREE.MathUtils.randFloatSpread(2500);
                const y = THREE.MathUtils.randFloatSpread(2500);
                const z = THREE.MathUtils.randFloatSpread(2500);
                dustVertices.push(x, y, z);
            }
            const dustGeometry = new THREE.BufferGeometry();
            dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dustVertices, 3));
            const dustMaterial = new THREE.PointsMaterial({ color: 0x495057, size: 0.3 });
            const dust = new THREE.Points(dustGeometry, dustMaterial);
            scene.add(dust);

            const handleMouseMove = (e) => {
                mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            };
            window.addEventListener('mousemove', handleMouseMove);

            const animate = () => {
                animationFrameId = requestAnimationFrame(animate);
                camera.position.x += (mouse.x * 4 - camera.position.x) * 0.06;
                camera.position.y += (mouse.y * 4 - camera.position.y) * 0.06;
                camera.lookAt(scene.position);
                stars.rotation.y -= 0.00025;
                dust.rotation.y -= 0.00032;
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
        document.body.style.backgroundColor = '#01020a';

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

    const experienceData = [
        { company: "Environomics Projects LLP", role: "Software Developer Intern", duration: "Jan 2025 - April 2025", points: ["Designed an advanced solar analytics dashboard.", "Utilized Prophet model for solar generation forecasting.", "Built a scalable React Native app with Supabase backend."] },
        { company: "Innomatics Research Labs", role: "Data Science Intern", duration: "Sept 2024 - Dec 2024", points: ["Built an AI-powered code reviewer for automated feedback.", "Authored Medium articles on NLP and search engine design.", "Designed ML models for diamond price prediction."] },
        { company: "IBM SkillsBuild", role: "AI/ML Intern", duration: "July 2024 - Aug 2024", points: ["Built a kidney stone prediction model with 81% accuracy.", "Designed a chatbot with WatsonX Assistant for eco-friendly choices."] },
        { company: "Infolabz IT Services", role: "Data Analysis and ML Intern", duration: "June 2024 - July 2024", points: ["Designed ETL pipelines with Python to transform API data.", "Built a house price prediction app using Streamlit.", "Trained a CNN to classify images of tablets and laptops."] }
    ];

    const blogData = [
        { title: "Evolution of Language Representation Techniques", desc: "A journey from Bag-of-Words and TF-IDF to advanced models like BERT and GPT.", link: "https://medium.com/@snehpatel0308/evolution-of-language-representation-techniques-a-journey-from-bow-to-gpt-99707199ef27" },
        { title: "Hacking System Design: How Search Engines Work", desc: "Demystifying how search engines rank, retrieve, and understand queries.", link: "https://medium.com/@snehpatel0308/hacking-the-system-design-how-search-engines-understand-and-deliver-results-83cf6a469628" }
    ];
    
    const projects = [
        { title: "Vehicle Lane-wise Counting", desc: "Real-time vehicle detection and tracking using YOLOv8 and SORT to count vehicles per lane.", tech: ["Python", "OpenCV", "YOLOv8"], link: "https://github.com/snehpatel38/vehicle_analysis", color: "#ffffff" },
        { title: "Infrastructure Change Detection", desc: "A Siamese U-Net model to detect changes in satellite imagery, achieving 97.3% accuracy.", tech: ["PyTorch", "Albumentations"], link: "https://www.kaggle.com/code/snehpatel3/intrastructure-cd", color: "#ffffff" },
        { title: "3D Brain Tumor Segmentation", desc: "Developed a 3D U-Net for MRI scan segmentation, achieving 96% validation accuracy.", tech: ["TensorFlow", "Keras", "Nibabel"], link: "https://snehpatel38.github.io/BraTS_segmentation_Using_3D_UNet/", color: "#ffffff" },
        { title: "MediLex: AI Medical Assistant", desc: "A RAG system for medical document Q&A using LangChain and Llama models.", tech: ["LangChain", "Streamlit", "FAISS"], link: "https://github.com/snehpatel38/MediLex", color: "#ffffff" },
        { title: "Workout Recommendation System", desc: "A content-based filtering system to provide personalized workout suggestions.", tech: ["Flask", "Scikit-learn", "Docker"], link: "https://snehpatel38.github.io/workout_recommendation_system/", color: "#ffffff" },
        { title: "Sentiment Analysis on Reviews", desc: "Applied a pre-trained BERT model for sentiment scoring on multilingual restaurant reviews.", tech: ["BERT", "PyTorch", "Hugging Face"], link: "https://github.com/snehpatel38/Sentiment_analysis_on_restaurant", color: "#ffffff" }
    ];

    return (
        <>
            <style>{`
                :root {
                    --section-padding-y: 10rem;
                    --container-padding: 1rem;
                }
                
                @media (min-width: 640px) {
                    :root {
                        --container-padding: 1.5rem;
                    }
                }
                
                @media (min-width: 1024px) {
                    :root {
                        --container-padding: 2rem;
                    }
                }
                
                @media (max-width: 768px) {
                    :root {
                        --section-padding-y: 6rem;
                    }
                }
                
                @media (max-width: 480px) {
                    :root {
                        --section-padding-y: 4rem;
                    }
                }
                
                .container {
                    max-width: 1200px;
                    margin-left: auto;
                    margin-right: auto;
                    padding-left: var(--container-padding);
                    padding-right: var(--container-padding);
                }
                
                section {
                    padding-top: var(--section-padding-y);
                    padding-bottom: var(--section-padding-y);
                }
                
                html {
                    scroll-behavior: smooth;
                }

                /* Header Styling */
                header {
                    transition: background-color 0.4s ease;
                }
                header.header-scrolled {
                    background-color: rgba(1, 2, 10, 0.9);
                    backdrop-filter: blur(10px);
                }
                .nav-link {
                    position: relative;
                    transition: color 0.3s ease;
                }
                .nav-link:hover, .nav-link.active { 
                    color: #a18aff; 
                }
                
                /* Mobile Menu */
                .mobile-menu {
                    padding-top: 4rem;
                }
                
                .mobile-menu-close {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    font-size: 1.5rem;
                    color: white;
                    background: none;
                    border: none;
                    cursor: pointer;
                }
                
                /* --- Enhanced Interactive Timeline --- */
                .timeline {
                    position: relative;
                    margin: 0 auto;
                    padding-left: 3rem; /* Increased padding for the new dot style */
                    max-width: 700px;
                }

              /* The dot on the timeline - CORRECTED */
                .timeline-dot {
                    position: absolute;
                    left: 0;
                    top: 0.5rem;
                    width: 1.5rem;
                    height: 1.5rem;
                    background: linear-gradient(135deg, #a18aff 60%, #0ea5e9 100%);
                    /* Change the border color to transparent */
                    border: 4px solid transparent; 
                    border-radius: 50%;
                    z-index: 2;
                    box-shadow: 0 0 10px 0px #a18aff88;
                    transition: all 0.3s ease;
                }

                @keyframes growLine {
                    from { transform: scaleY(0); }
                    to { transform: scaleY(1); }
                }

                .timeline-item {
                    position: relative;
                    margin-bottom: 2.5rem;
                    opacity: 0;
                    /* Staggered entry animation for each item */
                    animation: fadeInUp 0.5s ease-out forwards;
                }

                /* Stagger the animation for each item - you can add this via JS or manually */
                .timeline-item:nth-child(1) { animation-delay: 0.2s; }
                .timeline-item:nth-child(2) { animation-delay: 0.4s; }
                .timeline-item:nth-child(3) { animation-delay: 0.6s; }
                .timeline-item:nth-child(4) { animation-delay: 0.8s; }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .timeline-item:last-child {
                    margin-bottom: 0;
                }

                /* The dot on the timeline */
                .timeline-dot {
                    position: absolute;
                    left: 0;
                    top: 0.5rem; /* Adjusted for better alignment */
                    width: 1.5rem;
                    height: 1.5rem;
                    background: linear-gradient(135deg, #a18aff 60%, #0ea5e9 100%);
                    /* A subtle ring that matches the page background */
                    border: 4px solid #01020a; 
                    border-radius: 50%;
                    z-index: 2;
                    box-shadow: 0 0 10px 0px #a18aff88;
                    transition: all 0.3s ease;
                }

                /* The content card */
                .timeline-content {
                    margin-left: 2rem;
                    background: rgba(26, 26, 42, 0.5);
                    backdrop-filter: blur(4px);
                    border: 1px solid rgba(161, 138, 255, 0.2);
                    border-radius: 0.75rem;
                    padding: 1.5rem;
                    position: relative;
                    transition: all 0.3s ease;
                }

                /* Connector arrow pointing from the card to the dot */
                .timeline-content::before {
                    content: ' ';
                    position: absolute;
                    top: 1rem;
                    left: -0.5rem; /* Position it halfway over the margin */
                    height: 10px;
                    width: 10px;
                    background: rgba(26, 26, 42, 0.5);
                    border-style: solid;
                    border-width: 1px 0 0 1px;
                    border-color: rgba(161, 138, 255, 0.2);
                    transform: rotate(-45deg);
                    transition: all 0.3s ease;
                }

                /* --- Hover Effects --- */
                /* Make the entire item hoverable for a better user experience */
                .timeline-item:hover .timeline-dot {
                    transform: scale(1.1);
                    box-shadow: 0 0 25px 5px #a18aff66; /* Enhanced glow */
                    border-color: #a18aff;
                }

                .timeline-item:hover .timeline-content {
                    border-color: #a18aff;
                    box-shadow: 0 8px 30px rgba(161, 138, 255, 0.1);
                    background: rgba(161, 138, 255, 0.08);
                    transform: translateX(10px); /* Changed from translateY for a different feel */
                }

                .timeline-item:hover .timeline-content::before {
                    border-color: #a18aff transparent transparent #a18aff;
                    background: rgba(161, 138, 255, 0.08);
                }

                /* Responsive adjustments */
                @media (max-width: 600px) {
                    .timeline {
                        padding-left: 1.5rem;
                    }
                    .timeline-content {
                        margin-left: 1.5rem;
                        padding: 1rem;
                    }
                    .timeline-dot {
                        width: 1.25rem;
                        height: 1.25rem;
                        top: 0.7rem;
                        left: -0.1rem; /* Adjust for smaller padding */
                    }
                    .timeline-item:hover .timeline-content {
                        transform: translateX(5px); /* Less dramatic shift on mobile */
                    }
                }

                /* Project Cards */
                .project-card {
                    background: rgba(26, 26, 42, 0.4);
                    border: 1px solid rgb(42, 42, 66);
                    transition: all 0.3s ease;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                
                .project-card:hover {
                    background: rgba(26, 26, 42, 0.8); 
                    border-color: #a18aff; 
                    box-shadow: 0 0 20px 4px rgba(161, 138, 255, 0.2);
                    transform: translateY(-5px); 
                }
                
                /* Skills Grid */
                .skills-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 2rem;
                }
                
                @media (max-width: 640px) {
                    .skills-grid {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
                }
                
                .skill-category {
                    background: rgba(26, 26, 42, 0.4);
                    border: 1px solid rgb(42, 42, 66);
                    border-radius: 0.75rem;
                    padding: 1.5rem;
                    transition: all 0.3s ease;
                }
                
                .skill-category:hover {
                    border-color: #a18aff;
                    box-shadow: 0 0 15px 2px rgba(161, 138, 255, 0.15);
                    transform: translateY(-2px);
                }
                
                .skill-icons {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                    margin: 1rem 0;
                    justify-content: flex-start;
                }
                
                .skill-icon {
                    width: 32px;
                    height: 32px;
                    transition: transform 0.2s ease;
                }
                
                .skill-icon:hover {
                    transform: scale(1.1);
                }
                
                /* Typography Responsive */
                .hero-title {
                    font-size: clamp(2.5rem, 8vw, 5rem);
                    line-height: 1.1;
                }
                
                .hero-subtitle {
                    font-size: clamp(1.5rem, 5vw, 3.5rem);
                    line-height: 1.2;
                }
                
                .section-title {
                    font-size: clamp(2rem, 5vw, 2.5rem);
                }
                
                /* Projects Grid Responsive */
                .projects-grid {
                    display: grid;
                    gap: 1.5rem;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                }
                
                @media (max-width: 640px) {
                    .projects-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                }
                
                /* Blog Grid Responsive */
                .blog-grid {
                    display: grid;
                    gap: 1.5rem;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    max-width: 800px;
                    margin: 0 auto;
                }
                
                @media (max-width: 640px) {
                    .blog-grid {
                        grid-template-columns: 1fr;
                    }
                }
                
                /* Responsive spacing */
                .responsive-spacing {
                    padding: clamp(1rem, 4vw, 2rem);
                }
                
                /* Mobile menu improvements */
                @media (max-width: 768px) {
                    .mobile-menu-item {
                        padding: 1rem 1.5rem;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    }
                }
            `}</style>
            
            <BackgroundAnimation />

            <div className="relative min-h-screen" style={{zIndex: 1}}>
                <header className="fixed top-0 left-0 right-0 z-50 py-3 md:py-4">
                    <div className="container flex justify-between items-center">
                        <a href="#home" className="text-xl md:text-2xl font-bold text-white tracking-wider">Sneh Patel</a>
                        
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
                            <a href="#about" className="nav-link text-base lg:text-lg font-semibold text-gray-300">About</a>
                            <a href="#experience" className="nav-link text-base lg:text-lg font-semibold text-gray-300">Experience</a>
                            <a href="#skills" className="nav-link text-base lg:text-lg font-semibold text-gray-300">Skills</a>
                            <a href="#projects" className="nav-link text-base lg:text-lg font-semibold text-gray-300">Projects</a>
                            <a href="#blog" className="nav-link text-base lg:text-lg font-semibold text-gray-300">Blog</a>
                        </nav>
                        
                        {/* Desktop Social Links */}
                        <div className="hidden md:flex items-center space-x-4 lg:space-x-5">
                            <a href="https://linkedin.com/in/snehpatel38" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-xl lg:text-2xl text-gray-400 hover:text-white transition-colors flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28" fill="currentColor" style={{display:'block'}}>
                                    <path d="M27 0H5C2.2 0 0 2.2 0 5v22c0 2.8 2.2 5 5 5h22c2.8 0 5-2.2 5-5V5c0-2.8-2.2-5-5-5zM9.4 27H5.7V12h3.7v15zm-1.9-17.1c-1.2 0-2.1-1-2.1-2.1 0-1.2 1-2.1 2.1-2.1 1.2 0 2.1 1 2.1 2.1 0 1.2-1 2.1-2.1 2.1zm19.5 17.1h-3.7v-7.3c0-1.7-0.6-2.8-2.1-2.8-1.1 0-1.7 0.7-2 1.4-0.1 0.3-0.1 0.7-0.1 1.1V27h-3.7s0-13.7 0-15h3.7v2.1c0.5-0.8 1.4-2.1 3.5-2.1 2.6 0 4.5 1.7 4.5 5.3V27z"/>
                                </svg>
                            </a>
                            <a href="https://github.com/snehpatel38" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-xl lg:text-2xl text-gray-400 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.68 7.68 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.45.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                                </svg>
                            </a>
                        </div>
                        
                        {/* Mobile Menu Button */}
                        <button onClick={toggleMobileMenu} className="md:hidden text-2xl text-white p-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden fixed inset-0 bg-black/95 backdrop-blur-md z-50">
                            <div className="mobile-menu">
                                <button onClick={closeMobileMenu} className="mobile-menu-close">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div className="flex flex-col">
                                    <a href="#about" onClick={closeMobileMenu} className="mobile-menu-item text-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">About</a>
                                    <a href="#experience" onClick={closeMobileMenu} className="mobile-menu-item text-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Experience</a>
                                    <a href="#skills" onClick={closeMobileMenu} className="mobile-menu-item text-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Skills</a>
                                    <a href="#projects" onClick={closeMobileMenu} className="mobile-menu-item text-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Projects</a>
                                    <a href="#blog" onClick={closeMobileMenu} className="mobile-menu-item text-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Blog</a>
                                    <a href="#resume" onClick={closeMobileMenu} className="mobile-menu-item text-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Contact</a>
                                </div>
                                
                                {/* Mobile Social Links */}
                                <div className="flex justify-center space-x-6 mt-8 px-6">
                                    <a href="https://linkedin.com/in/snehpatel38" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-2xl text-gray-400 hover:text-white transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
                                            <path d="M0 1.146C0 .513.324 0 .725 0h14.55c.4 0 .725.513.725 1.146v13.708c0 .633-.324 1.146-.725 1.146H.725A.723.723 0 0 1 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.21c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.341-1.248-.822 0-1.358.54-1.358 1.248 0 .694.521 1.248 1.326 1.248h.015zm4.908 8.21h2.4V9.359c0-.215.015-.43.08-.586.176-.43.576-.876 1.247-.876.88 0 1.233.66 1.233 1.63v4.867h2.4V9.19c0-2.22-1.184-3.252-2.764-3.252-1.273 0-1.845.7-2.165 1.19h.015v-1.02h-2.4c.03.66 0 7.225 0 7.225z"/>
                                        </svg>
                                    </a>
                                    <a href="https://github.com/snehpatel38" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-2xl text-gray-400 hover:text-white transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.68 7.68 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.45.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </header>

                <main>
                    {/* Hero Section */}
                    <section id="home" className="min-h-screen flex flex-col justify-center items-center text-center responsive-spacing">
                        <p className="text-lg md:text-xl text-purple-400 mb-4">Hi, I'm</p>
                        <h1 className="hero-title font-extrabold mb-4 text-white">Sneh Patel.</h1>
                        <h2 className="hero-subtitle font-extrabold mb-6 md:mb-8 text-gray-400">Aspiring AI Engineer</h2>
                        <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto mb-6 md:mb-8 leading-relaxed px-4">
                            I am passionate about building intelligent systems that create real-world impact in applied AI, computer vision, and natural language processing. I am particularly interested in leveraging AI for life sciences and healthcare innovations, solving practical problems that improve lives.
                        </p>
                        <div className="flex justify-center items-center gap-6 text-2xl md:text-3xl text-gray-400">
                            <a href="https://github.com/snehpatel38" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.68 7.68 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.45.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                                </svg>
                            </a>
                            <a href="https://linkedin.com/in/snehpatel38" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-xl lg:text-2xl text-gray-400 hover:text-white transition-colors flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28" fill="currentColor" style={{display:'block'}}>
                                    <path d="M27 0H5C2.2 0 0 2.2 0 5v22c0 2.8 2.2 5 5 5h22c2.8 0 5-2.2 5-5V5c0-2.8-2.2-5-5-5zM9.4 27H5.7V12h3.7v15zm-1.9-17.1c-1.2 0-2.1-1-2.1-2.1 0-1.2 1-2.1 2.1-2.1 1.2 0 2.1 1 2.1 2.1 0 1.2-1 2.1-2.1 2.1zm19.5 17.1h-3.7v-7.3c0-1.7-0.6-2.8-2.1-2.8-1.1 0-1.7 0.7-2 1.4-0.1 0.3-0.1 0.7-0.1 1.1V27h-3.7s0-13.7 0-15h3.7v2.1c0.5-0.8 1.4-2.1 3.5-2.1 2.6 0 4.5 1.7 4.5 5.3V27z"/>
                                </svg>
                            </a>
                            <a href="mailto:snehpatel0308@gmail.com" className="hover:text-purple-400 transition-colors p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-envelope" viewBox="0 0 16 16">
                                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                                </svg>
                            </a>
                        </div>
                    </section>

                    <div className="container">
                        {/* About Section */}
                        <section id="about">
                            <div className="max-w-4xl mx-auto text-center">
                                <h2 className="section-title font-bold mb-8 text-white">Education</h2>
                                <div className="rounded-lg p-4 md:p-6 border border-gray-800 bg-gray-900/30 text-left">
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Gujarat Technological University</h3>
                                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-4 gap-y-1 items-start sm:items-center mb-4">
                                        <span className="text-sky-300 font-medium text-sm md:text-base">Ahmedabad, India</span>
                                        <span className="text-gray-400 font-medium text-sm md:text-base">BE - Computer Engineering</span>
                                        <span className="text-green-300 font-medium text-sm md:text-base">CGPA: 9.02/10.00</span>
                                    </div>
                                    <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
                                        <li>Presented a review paper on a team project titled <span className="font-semibold text-purple-200">'Image Encryption and Decryption'</span></li>
                                        <li>Won <span className="font-semibold text-yellow-200">1st prize</span> in an inter-college tech competition</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Experience Section */}
                        <section id="experience">
                            <h2 className="section-title font-bold mb-8 md:mb-12 text-center text-white">Professional Experience</h2>
                            <div className="timeline">
                                {experienceData.map((exp, idx) => (
                                    <div key={exp.company + idx} className="timeline-item">
                                        <div className="timeline-dot"></div>
                                        <div className="timeline-content">
                                            <p className="text-gray-400 mb-1 text-sm md:text-base">{exp.duration}</p>
                                            <h3 className="text-lg md:text-xl font-bold text-sky-400 mb-1">{exp.role}</h3>
                                            <h4 className="text-base md:text-lg font-semibold text-white mb-3">{exp.company}</h4>
                                            <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm md:text-base">
                                                {exp.points.map((point, i) => <li key={exp.company + '-' + i}>{point}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Skills Section */}
                        <section id="skills">
                            <div className="max-w-6xl mx-auto">
                                <h2 className="section-title font-bold mb-8 md:mb-10 text-center text-white">Skills</h2>
                                <div className="skills-grid">
                                    <div className="skill-category">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-lg font-bold text-purple-300">Languages</span>
                                        </div>
                                        <div className="skill-icons">
                                            <img src="https://skillicons.dev/icons?i=python" alt="Python" title="Python" className="skill-icon" onError={e => e.currentTarget.style.display='none'} />
                                            <img src="https://skillicons.dev/icons?i=c" alt="C" title="C/C++" className="skill-icon" onError={e => e.currentTarget.style.display='none'} />
                                            <img src="https://skillicons.dev/icons?i=julia" alt="Julia" title="Julia" className="skill-icon" onError={e => e.currentTarget.style.display='none'} />
                                            <img src="https://skillicons.dev/icons?i=mysql" alt="MySQL" title="SQL" className="skill-icon" onError={e => e.currentTarget.style.display='none'} />
                                        </div>
                                        <div className="text-gray-200 text-sm">Python, C/C++, Julia, SQL</div>
                                    </div>
                                    
                                    <div className="skill-category">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-lg font-bold text-orange-300">Databases</span>
                                        </div>
                                        <div className="skill-icons">
                                            <img src="https://skillicons.dev/icons?i=mysql" alt="MySQL" title="MySQL" className="skill-icon" />
                                            <img src="https://skillicons.dev/icons?i=sqlite" alt="SQLite" title="SQLite" className="skill-icon" />
                                            <img src="https://skillicons.dev/icons?i=postgres" alt="PostgreSQL" title="PostgreSQL" className="skill-icon" />
                                        </div>
                                        <div className="text-gray-200 text-sm">MySQL, SQLite, PostgreSQL</div>
                                    </div>
                                    
                                    <div className="skill-category">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-lg font-bold text-sky-300">Machine Learning</span>
                                        </div>
                                        <div className="skill-icons">
                                            <img src="https://icon.icepanel.io/Technology/svg/scikit-learn.svg" alt="Scikit-learn" title="Scikit-learn" className="skill-icon" />
                                            <img src="https://icon.icepanel.io/Technology/png-shadow-512/Pandas.png" alt="Pandas" title="Pandas" className="skill-icon" />
                                            <img src="https://icon.icepanel.io/Technology/svg/NumPy.svg" alt="NumPy" title="NumPy" className="skill-icon" />
                                            <img src="https://icon.icepanel.io/Technology/svg/Matplotlib.svg" alt="Matplotlib" title="Matplotlib" className="skill-icon" />
                                        </div>
                                        <div className="text-gray-200 text-sm">Linear & Logistic Regression, Decision Trees, SVM, Random Forest, Clustering, EDA, Model Evaluation</div>
                                    </div>
                                    
                                    <div className="skill-category">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-lg font-bold text-pink-300">Deep Learning</span>
                                        </div>
                                        <div className="skill-icons">
                                            <img src="https://skillicons.dev/icons?i=tensorflow" alt="TensorFlow" title="TensorFlow" className="skill-icon" />
                                            <img src="https://skillicons.dev/icons?i=pytorch" alt="PyTorch" title="PyTorch" className="skill-icon" />
                                        </div>
                                        <div className="text-gray-200 text-sm">ANN, CNN, RNN, LSTM, GRU, Transformers, BERT, GPT, Transfer Learning</div>
                                    </div>
                                    
                                    <div className="skill-category">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-lg font-bold text-green-300">NLP & LLMs</span>
                                        </div>
                                        <div className="skill-icons">
                                            <img src="https://custom.typingmind.com/assets/models/huggingface.png" alt="HuggingFace" title="HuggingFace" className="skill-icon" />
                                            <img src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/langchain-color.png" alt="LangChain" title="LangChain" className="skill-icon" />
                                            <img src="https://custom.typingmind.com/assets/models/gemini.png" alt="Gemini" title="Gemini" className="skill-icon" />
                                            <img src="https://custom.typingmind.com/assets/models/gpt-35.webp" alt="GPT-35" title="GPT-35" className="skill-icon" />
                                            <img src="https://custom.typingmind.com/assets/models/mistralai.png" alt="Mistral" title="Mistral" className="skill-icon" />
                                            <img src="https://custom.typingmind.com/assets/models/llama.png" alt="LLaMA" title="LLaMA" className="skill-icon" />
                                        </div>
                                        <div className="text-gray-200 text-sm">HuggingFace Transformers, Tokenization, Attention Mechanisms, Chatbot Development, Sentiment Analysis</div>
                                    </div>
                                    
                                    <div className="skill-category">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-lg font-bold text-lime-300">Development</span>
                                        </div>
                                        <div className="skill-icons">
                                            <img src="https://skillicons.dev/icons?i=flask" alt="Flask" title="Flask" className="skill-icon" />
                                            <img src="https://skillicons.dev/icons?i=fastapi" alt="FastAPI" title="FastAPI" className="skill-icon" />
                                            <img src="https://img.icons8.com/?size=100&id=Rffi8qeb2fK5&format=png&color=000000" className="skill-icon" />
                                            <img src="https://www.vectorlogo.zone/logos/onnxai/onnxai-icon.svg" alt="ONNX" title="ONNX" className="skill-icon" />
                                        </div>
                                        <div className="text-gray-200 text-sm">Flask, FastAPI, Streamlit, ONNX</div>
                                    </div>
                                    
                                    <div className="skill-category">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-lg font-bold text-yellow-300">Computer Vision</span>
                                        </div>
                                        <div className="skill-icons">
                                            <img src="https://github.com/tandpfun/skill-icons/raw/main/icons/OpenCV-Dark.svg" alt="OpenCV" title="OpenCV" className="skill-icon" />
                                            <img src="https://e7.pngegg.com/pngimages/437/823/png-clipart-yolo-object-detection-darknet-opencv-convolutional-neural-network-joint-miscellaneous-text-thumbnail.png" alt="YOLO" title="YOLO" className="skill-icon" />
                                            <img src="https://github.com/tandpfun/skill-icons/raw/main/icons/Matlab-Dark.svg" alt="Matlab" title="Matlab" className="skill-icon" />    
                                        </div>
                                        <div className="text-gray-200 text-sm">OpenCV, Scikit-Image, Matlab, YOLO</div>
                                    </div>
                                    
                                    <div className="skill-category">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-lg font-bold text-blue-300">Tools & Platforms</span>
                                        </div>
                                        <div className="skill-icons">
                                            <img src="https://skillicons.dev/icons?i=git" alt="Git" title="Git" className="skill-icon" />
                                            <img src="https://skillicons.dev/icons?i=docker" alt="Docker" title="Docker" className="skill-icon" />
                                            <img src="https://skillicons.dev/icons?i=vscode" alt="VS Code" title="VS Code" className="skill-icon" />
                                            <img src="https://skillicons.dev/icons?i=anaconda" alt="Anaconda" title="Anaconda" className="skill-icon" />
                                            <img src="https://skillicons.dev/icons?i=arduino" alt="Arduino" title="Arduino IDE" className="skill-icon" />
                                            <img src="https://github.com/tandpfun/skill-icons/raw/main/icons/PyCharm-Dark.svg" alt="PyCharm" title="PyCharm" className="skill-icon" />
                                            <img src="https://github.com/tandpfun/skill-icons/raw/main/icons/AndroidStudio-Dark.svg" alt="Android Studio" title="Android Studio" className="skill-icon" />
                                        </div>
                                        <div className="text-gray-200 text-sm">Git, Docker, Jupyter Notebook, VS Code, Anaconda, Spyder, Arduino IDE</div>
                                    </div>
                                    
                                    <div className="skill-category">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-lg font-bold text-red-300">Medical Imaging</span>
                                        </div>
                                        <div className="text-gray-200 text-sm">NiBabel, PyDicom, 3D Slicer, MONAI (beginner)</div>
                                    </div>
                                    
                                    <div className="skill-category">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-lg font-bold text-teal-300">Geospatial & Remote Sensing</span>
                                        </div>
                                        <div className="text-gray-200 text-sm">Google Earth Engine, QGIS (beginner)</div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        
                        {/* Projects Section */}
                        <section id="projects">
                            <h2 className="section-title font-bold mb-8 md:mb-10 text-center text-white">Featured Projects</h2>
                            <div className="projects-grid">
                                {projects.map((p, idx) => (
                                    <div key={p.title + idx} className="project-card p-4 md:p-6 rounded-lg">
                                        <h3 className="text-lg md:text-xl font-bold mb-3 text-white">{p.title}</h3>
                                        <p className="text-gray-300 flex-grow text-sm md:text-base mb-4">{p.desc}</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {p.tech.map((t, i) => (
                                                <span key={p.title + '-' + t + '-' + i} className="text-xs px-2 py-1 rounded font-semibold text-sky-300 bg-sky-900/50">{t}</span>
                                            ))}
                                        </div>
                                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-auto px-4 py-2 rounded-md font-semibold text-gray-300 border border-gray-700 hover:border-purple-500 hover:text-white transition-colors text-sm text-center w-full md:w-auto">
                                            View Project
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Blog Section */}
                        <section id="blog">
                            <h2 className="section-title font-bold mb-8 md:mb-10 text-center text-white">Blog Articles</h2>
                            <div className="blog-grid">
                                {blogData.map((post, idx) => (
                                    <a href={post.link} target="_blank" rel="noopener noreferrer" key={post.title + idx} className="project-card block p-4 md:p-6 rounded-lg">
                                        <h3 className="text-lg md:text-xl font-bold text-white mb-3">{post.title}</h3>
                                        <p className="text-gray-300 text-sm md:text-base">{post.desc}</p>
                                    </a>
                                ))}
                            </div>
                        </section>
                        
                        {/* Contact Section */}
                        <section id="resume" className="text-center">
                            <h2 className="section-title font-bold mb-6 text-white">Get In Touch</h2>
                            <p className="text-base md:text-lg text-gray-400 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
                                My inbox is always open. Whether you have a question or just want to say hi, I'll do my best to get back to you!
                            </p>
                            <a
                                href="mailto:snehpatel0308@gmail.com"
                                className="inline-block bg-[#ede5dd] hover:bg-[#e0d6cc] text-[#473a2a] font-semibold py-3 md:py-4 px-6 md:px-10 rounded-lg transition-colors text-base md:text-lg shadow-lg"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Say Hello
                            </a>
                        </section>
                    </div>
                </main>

                <footer className="py-6 md:py-8 text-center text-gray-500 border-t border-gray-800/30 mt-8 md:mt-10">
                    <div className="container">
                        <p className="text-sm md:text-base">Designed & Built by Sneh Patel</p>
                    </div>
                </footer>
            </div>
        </>
    );
}