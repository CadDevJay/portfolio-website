const blogs = [
  {
    title: "BIM Is Not Just Modeling",
    summary:
      "How process discipline, not just software speed, defines project quality in high-pressure AEC delivery.",
    tag: "Digital Delivery"
  },
  {
    title: "Coordination Readiness Checklist",
    summary:
      "A practical routine to validate model health before meetings, reducing emergency RFIs and rework churn.",
    tag: "Coordination"
  },
  {
    title: "From Site Constraints to Smart Systems",
    summary:
      "Applying field realities to BIM decisions so digital models remain construction-ready, not presentation-only.",
    tag: "Execution"
  }
];

const projects = [
  {
    title: "MEP Clash Elimination Sprint",
    description:
      "Led cross-discipline model reviews to resolve clashes early, protecting construction sequence and reducing avoidable site disruption.",
    tech: ["Revit", "Navisworks", "BEP", "CDE"]
  },
  {
    title: "Constructability Feedback Loop",
    description:
      "Built a repeatable model-to-site issue loop connecting design updates, coordination inputs, and execution constraints.",
    tech: ["QA/QC", "RFI", "Coordination", "Issue Tracking"]
  },
  {
    title: "Digital Handover Alignment",
    description:
      "Structured data and model standards for clearer handover outcomes and lifecycle-ready project information.",
    tech: ["Data Standards", "Asset Tagging", "Validation"]
  }
];

const resources = [
  {
    title: "BIM Career Transition Map",
    copy: "A stepwise roadmap from site engineer to BIM coordinator with portfolio and interview checkpoints."
  },
  {
    title: "Model Review Scorecard",
    copy: "A simple, reusable scorecard to evaluate geometry quality, data completeness, and coordination fitness."
  },
  {
    title: "BEP Kickoff Template",
    copy: "A starter structure for defining BIM scope, role clarity, and exchange protocols at project start."
  },
  {
    title: "Clash Governance Guide",
    copy: "How to classify, prioritize, and close clashes with accountability across disciplines."
  }
];

function renderCards() {
  const blogsGrid = document.getElementById("blogs-grid");
  const projectsGrid = document.getElementById("projects-grid");
  const resourcesGrid = document.getElementById("resources-grid");

  blogs.forEach((blog) => {
    const node = document.createElement("article");
    node.className = "card tilt";
    node.innerHTML = `
      <h3>${blog.title}</h3>
      <p>${blog.summary}</p>
      <div class="tags"><span>${blog.tag}</span></div>
    `;
    blogsGrid.appendChild(node);
  });

  projects.forEach((project) => {
    const tech = project.tech.map((item) => `<span>${item}</span>`).join("");
    const node = document.createElement("article");
    node.className = "project tilt";
    node.innerHTML = `
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="tags">${tech}</div>
    `;
    projectsGrid.appendChild(node);
  });

  resources.forEach((resource) => {
    const node = document.createElement("article");
    node.className = "resource tilt";
    node.innerHTML = `
      <h3>${resource.title}</h3>
      <p>${resource.copy}</p>
    `;
    resourcesGrid.appendChild(node);
  });
}

function setupInteractions() {
  const progress = document.getElementById("progress-bar");
  const nav = document.getElementById("main-nav");
  const navToggle = document.getElementById("nav-toggle");

  navToggle?.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = `${value}%`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));

  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -8;
      const rotateY = ((x / rect.width) - 0.5) * 10;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

async function bootScene() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const canvas = document.getElementById("scene-canvas");

  try {
    const THREE = await import("https://unpkg.com/three@0.164.1/build/three.module.js");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 120);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.position.set(0, 0, 16);

    const ambient = new THREE.AmbientLight(0xb5d8ff, 0.6);
    scene.add(ambient);

    const point = new THREE.PointLight(0x00d8c3, 2.1, 70);
    point.position.set(8, 8, 8);
    scene.add(point);

    const warm = new THREE.PointLight(0xff9052, 1.5, 60);
    warm.position.set(-10, -7, 6);
    scene.add(warm);

    const group = new THREE.Group();
    scene.add(group);

    const meshes = [];
    const colors = [0x00d8c3, 0xff9052, 0xbdf271];

    for (let index = 0; index < 12; index += 1) {
      const geometry = index % 2 === 0
        ? new THREE.TorusGeometry(1 + Math.random(), 0.18, 14, 44)
        : new THREE.BoxGeometry(1.1, 1.1, 1.1);

      const material = new THREE.MeshStandardMaterial({
        color: colors[index % colors.length],
        metalness: 0.72,
        roughness: 0.32,
        wireframe: index % 3 === 0
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 26,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 16
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      mesh.userData.speed = (Math.random() * 0.0025) + 0.0008;
      meshes.push(mesh);
      group.add(mesh);
    }

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onResize);

    const mouse = { x: 0, y: 0 };
    window.addEventListener("pointermove", (event) => {
      mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (event.clientY / window.innerHeight - 0.5) * 2;
    });

    const animate = () => {
      meshes.forEach((mesh, i) => {
        mesh.rotation.x += mesh.userData.speed;
        mesh.rotation.y += mesh.userData.speed * 1.3;
        mesh.position.y += Math.sin(performance.now() * 0.0006 + i) * 0.0014;
      });

      group.rotation.y += 0.001 + mouse.x * 0.002;
      group.rotation.x += mouse.y * 0.001;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();
  } catch (error) {
    console.warn("3D scene unavailable", error);
  }
}

function setYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

renderCards();
setupInteractions();
bootScene();
setYear();
