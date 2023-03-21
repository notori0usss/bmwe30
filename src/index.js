import {
  ViewerApp,
  AssetManagerPlugin,
  addBasePlugins,
  CanvasSnipperPlugin,
} from 'webgi';
import './styles.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Pane } from 'tweakpane';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.defaults({ scroller: '.mainContainer' });
async function setupViewer() {
  const viewer = new ViewerApp({
    canvas: document.getElementById('webgi-canvas'),
    useRgbm: false,
    isAntialiased: true,
  });
  const data = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
  };
  const pane = new Pane();
  viewer.renderer.displayCanvasScaling = Math.min(window.devicePixelRatio, 1);

  const manager = await viewer.addPlugin(AssetManagerPlugin);
  await addBasePlugins(viewer);

  const importer = manager.importer;
  importer.addEventListener('onProgress', (ev) => {
    const progress = ev.loaded / ev.total;

    document
      .querySelector('.progress')
      .setAttribute('style', `transform:scaleX(${progress})`);
  });
  importer.addEventListener('onLoad', () => {
    introAnimation();
  });

  await viewer.addPlugin(CanvasSnipperPlugin);
  viewer.renderer.refreshPipeline();
  const model = await manager.addFromPath('./assets/scene.glb');
  const Object3D = model[0].modelObject;
  const modelPosition = Object3D.position;
  const modelRotation = Object3D.rotation;
  const loadingElment = document.querySelector('.loader');

  function introAnimation() {
    const timeline = gsap.timeline();
    timeline.to('.loader', {
      x: '150%',
      duration: 0.8,
      ease: 'power4.inOut',
      delay: 1,
      onComplete: setupScrollAnimation,
    });
  }
  pane.addInput(data, 'position', {
    x: { step: 0.01 },
    y: { step: 0.01 },
    z: { step: 0.01 },
  });
  pane.addInput(data, 'rotation', {
    x: { min: -6.28, max: 6.28, step: 0.001 },
    y: { min: -6.28, max: 6.28, step: 0.001 },
    z: { min: -6.28, max: 6.28, step: 0.001 },
  });
  pane.on('change', (e) => {
    if (e.presetKey === 'rotation') {
      const { x, y, z } = e.value;
      modelRotation.set(x, y, z);
    } else {
      const { x, y, z } = e.value;
      modelPosition.set(x, y, z);
    }
    onUpdate();
  });
  function setupScrollAnimation() {
    document.body.removeChild(loadingElment);
    const t2 = gsap.timeline();
    t2.to(modelPosition, {
      x: -0.9,
      y: -0.43,
      z: 0,
      scrollTrigger: {
        trigger: '.first',
        start: 'top top',
        end: 'top top',
        scrub: 0.2,
        immediateRender: false,
      },
      onUpdate,
    })

      .to(modelPosition, {
        x: -1.36,
        y: -0.02,
        z: -0.22,
        scrollTrigger: {
          trigger: '.second',
          start: 'top bottom',
          end: 'top top',
          scrub: 0.2,
          immediateRender: false,
        },
        onUpdate,
      })

      .to(modelRotation, {
        x: 0.0,
        y: 0,
        z: -1.57,
        scrollTrigger: {
          trigger: '.second',
          start: 'top bottom',
          end: 'top top',
          scrub: 0.2,
          immediateRender: false,
        },
      })

      .to(modelPosition, {
        x: 0.38,
        y: -0.11,
        z: -1.06,
        scrollTrigger: {
          trigger: '.third',
          start: 'top bottom',
          end: 'top top',
          scrub: 0.2,
          immediateRender: false,
        },
        onUpdate,
      })

      .to(modelRotation, {
        x: 0.403,
        y: 0.957,
        z: -0.421,
        scrollTrigger: {
          trigger: '.third',
          start: 'top bottom',
          end: 'top top',
          scrub: 0.2,
          immediateRender: false,
        },
      })

      .to(modelPosition, {
        x: 0.92,
        y: -0.31,
        z: 0.66,
        scrollTrigger: {
          trigger: '.fourth',
          start: 'top bottom',
          end: 'top top',
          scrub: 0.2,
          immediateRender: false,
        },
        onUpdate,
      })

      .to(modelRotation, {
        x: 0.0,
        y: 1.641,
        z: 0,
        scrollTrigger: {
          trigger: '.fourth',
          start: 'top bottom',
          end: 'top top',
          scrub: 0.2,
          immediateRender: false,
        },
      })
      .to(modelPosition, {
        x: -0.1,
        y: -0.11,
        z: 0.99,
        scrollTrigger: {
          trigger: '.fifth',
          start: 'top bottom',
          end: 'top top',
          scrub: 0.2,
          immediateRender: false,
        },
        onUpdate,
      })
      .to(modelRotation, {
        x: -0.785,
        y: 2.329,
        z: 0.903,
        scrollTrigger: {
          trigger: '.fifth',
          start: 'top bottom',
          end: 'top top',
          scrub: 0.2,
          immediateRender: false,
        },
      })

      .to(modelPosition, {
        x: 0.16,
        y: -0.3,
        z: -0.56,
        scrollTrigger: {
          trigger: '.sixth',
          start: 'top bottom',
          end: 'top top',
          scrub: 0.2,
          immediateRender: false,
        },
        onUpdate,
      })

      .to(modelRotation, {
        x: -0.261,
        y: 4.911,
        z: -0.277,
        scrollTrigger: {
          trigger: '.sixth',
          start: 'top bottom',
          end: 'top top',
          scrub: 0.2,
          immediateRender: false,
        },
      });
  }
  function onUpdate() {
    viewer.setDirty();
  }
}

setupViewer();
