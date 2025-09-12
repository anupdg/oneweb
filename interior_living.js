class DOMUtils {
  static createImage({ src, alt, onClick }) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt || "";
    img.classList.add("item-img");
    if (onClick) img.addEventListener("click", onClick);
    return img;
  }

  static createTextSpan(text, onClick) {
    const span = document.createElement("span");
    span.textContent = text;
    span.classList.add("item-img");
    if (onClick) span.addEventListener("click", onClick);
    return span;
  }

  static clearChildren(element) {
    if (element) element.innerHTML = "";
  }

  static removeActiveFromSiblings(element, className) {
    if (!element) return;
    element.querySelectorAll(`.${className}`).forEach((el) =>
      el.classList.remove(className)
    );
  }
}

class SceneController {
  constructor(frame) {
    this.frame = frame;
    this.messages = {
      MESH_SHOW_HIDE: "980A9415-2888-4596-BDB0-37DE9CA99702",
      GOTO_VIEW: "0047F251-C4C9-4163-BD66-E78E2096AB0B",
      MATERIALS_EDITABLE: "FC9B8633-FB7E-4CDB-B9B4-9C7402805EB8",
      NODES_EDITABLE: "B3331D7E-5FEA-4763-959F-BB468F7A2252",
      APPLY_MATERIAL: "22D78DEB-39B2-4DB4-A560-5B0C143B02F8",
      READY_FOR_EDITABLE: "11AC52C9-D395-4B50-A0BE-B8F993218F8A",
      ANCHORS_FROM_MENU: "B615910B-0253-4334-B7FD-B9CFCFD3E155",
      CUSTOM_TEXTURE: "9BFBEC93-95BA-4CC4-996B-EB889F5C0E7C",
    };
  }

  postMessage(message) {
    if (this.frame && this.frame.contentWindow) {
      this.frame.contentWindow.postMessage(message, "*");
    }
  }

  goToView(view) {
    this.postMessage({ type: this.messages.GOTO_VIEW, view });
  }

  setMaterialsEditable(extensions) {
    this.postMessage({ type: this.messages.MATERIALS_EDITABLE, extensions });
  }

  setNodesEditable(nodes) {
    this.postMessage({ type: this.messages.NODES_EDITABLE, nodes });
  }

  showHideNode(node, nodesTohide) {
    this.postMessage({
      type: this.messages.MESH_SHOW_HIDE,
      node,
      nodesTohide,
    });
  }

  applyMaterial(node, material) {
    this.postMessage({ type: this.messages.APPLY_MATERIAL, node, material });
  }

  setCustomAnchors(anchors) {
    console.log("Sending anchors", anchors);
    this.postMessage({ type: this.messages.ANCHORS_FROM_MENU, anchors });
  }
  sendTexture(url, node, materialName) {
    console.log("Sending custom texture", url, node);
    this.postMessage({
      type: this.messages.CUSTOM_TEXTURE,
      url,
      node,
      materialName,
    });
  }
}

class DisplayManager {
  constructor(container) {
    this.container = container;
  }

  renderItems(items, onClick) {
    DOMUtils.clearChildren(this.container);

    items.forEach((item) => {
      const tile = document.createElement("div");
      tile.className = "item-tile";
      tile.addEventListener("click", () => {
        this.selectItem(tile);
        onClick(item);
      });

      const img = document.createElement("img");
      img.src = item.url || "";
      img.alt = item.name || "";
      img.className = "item-thumbnail";

      const label = document.createElement("div");
      label.className = "item-label";
      label.textContent = app.itemLabelMap[item.name] || item.name;

      tile.appendChild(img);
      tile.appendChild(label);

      this.container.appendChild(tile);
    });
  }

  selectItem(item) {
    DOMUtils.removeActiveFromSiblings(this.container, "img-selected");
    item.classList.add("img-selected");
  }

  clear() {
    DOMUtils.clearChildren(this.container);
  }
}

class App {
  constructor() {
    this.sceneFrame = document.getElementById("video-frame");
    this.elementSelector = document.getElementById("element-selector");
    this.meshTab = document.getElementById("mesh");
    this.materialTab = document.getElementById("material");
    this.displayManager = new DisplayManager(
      document.getElementById("display-container")
    );
    this.sceneController = new SceneController(this.sceneFrame);
    this.selectedOption = "";
    this.nodes = {};
    this.anchorsFromMenu = [];
    this.materialImageMap = {
  "Bloom": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Bloom.webp?v=1755240214",
    "sku": "WP0109"
  },
  "Beigewheel": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Beigewheel.webp?v=1755236747",
    "sku": "WP0115"
  },
  "Sagecrane": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Sagecrane.webp?v=1755236747",
    "sku": "WP0114"
  },
  "Coralmist": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Coralmist.webp?v=1755236746",
    "sku": "WP0113"
  },
  "Blushaviary": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Blushaviary.webp?v=1755236747",
    "sku": "WP0112"
  },
  "Tealaviary": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Tealaviary.webp?v=1755236747",
    "sku": "WP0111"
  },
  "Rosagrove": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Rosagrove.webp?v=1755236746",
    "sku": "WP0110"
  },
  "Lilacstone": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Lilacstone.webp?v=1755237068",
    "sku": "WP0116_SA"
  },
  "Azura": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Azura.webp?v=1755237069",
    "sku": "WP0108"
  },
  "Florawood": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Florawood.webp?v=1755237069",
    "sku": "WP0107"
  },
  "Teal Medallion": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Teal_Medallion.webp?v=1755237069",
    "sku": "WP0106"
  },
  "Terracotta Medallione": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Terracotta_Medallione.webp?v=1755237069",
    "sku": "WP0105"
  },
  "Featherfield": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Featherfield.webp?v=1755237068",
    "sku": "WP0104"
  },
  "Meadow Lace": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Meadow_Lace.webp?v=1755237069",
    "sku": "WP0103"
  },
  "Oroflora": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Oraflora.webp?v=1755237068",
    "sku": "WP0102"
  },
  "Aqualora": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Aqualora.webp?v=1755237069",
    "sku": "WP0101"
  },
  "Lunara": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Lunara.webp?v=1755236572",
    "sku": "CP0101"
  },
  "Arda": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Arda.webp?v=1755236572",
    "sku": "CP0109"
  },
  "Rosefern": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Rossefern.webp?v=1755236572",
    "sku": "CP0105"
  },
  "Seaforest": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Seaforest.webp?v=1755236572",
    "sku": "CP0103"
  },
  "Midnightfern": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Rossefern.webp?v=1755236572",
    "sku": "CP0107"
  },
  "Stonebloom": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Stonebloom.webp?v=1755236572",
    "sku": "UP0105"
  },
  "Kayla": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Kayla.webp?v=1755236572",
    "sku": "CP0102"
  },
  "Cloudpetal": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Cloudpetal.webp?v=1755236572",
    "sku": "CP0106"
  },
  "Verdanta": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Verdanta.webp?v=1755236572",
    "sku": "CP0104"
  },
  "Saharine": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Saharine.webp?v=1755236630",
    "sku": "CP0110"
  },
  "Ashloom": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Ashloom.webp?v=1755236402",
    "sku": "UP0106"
  },
  "Clayweave": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Clayweave.webp?v=1755236402",
    "sku": "UP0101"
  },
  "Sandvelour": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Sandvelour.webp?v=1755236402",
    "sku": "UP0107"
  },
  "Skybloom": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Skybloom.webp?v=1755236402",
    "sku": "UP0105"
  },
  "Stonegrid": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Stonegrid.webp?v=1755236400",
    "sku": "UP0104"
  },
  "Terrastripe": {
    "url": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Terrastripe.webp?v=1755236402",
    "sku": "UP0103"
  }
};
    this.meshMap = {
  "panel1": [
    {
      "name": "{Petalarch}Object010",
      "url": "https://img.freepik.com/free-vector/classic-white-wall-with-wooden-frames_107791-29834.jpg?w=740",
      "default": true
    }
  ],
  "panel2": [
    {
      "name": "{Lilacstone}Walls_01.004",
      "url": "https://img.freepik.com/free-photo/empty-modern-luxury-room-interior-design_53876-176890.jpg?w=740",
      "default": true
    }
  ],
  "rug": [
    {
      "name": "SM_Living004",
      "url": "https://img.freepik.com/free-photo/aesthetic-textile-background-ethnic-pattern_53876-128222.jpg?w=740",
      "default": true
    }
  ],
  "sofa": [
    {
      "name": "{sofa_fab}Shape25",
      "url": "https://img.freepik.com/free-psd/midcentury-modern-grey-sofa-with-wooden-frame_632498-25556.jpg?w=740",
      "default": true
    },
    {
      "name": "s2",
      "url": "https://img.freepik.com/free-psd/teal-velvet-sofa-with-gold-accents-elegant-modern-living-room-furniture_191095-80919.jpg?w=740",
      "default": false
    },
    {
      "name": "s3",
      "url": "https://img.freepik.com/free-psd/modern-wooden-sofa-with-natureinspired-design_191095-83780.jpg?w=740",
      "default": false
    }
  ]
};
    this.viewMap = {
  "panel1": "Console",
  "panel2": "Sofa",
  "rug": "Sofa",
  "sofa": "Sofa"
};
    this.anchorIdToDropdownKey = {
  "panel1": "panel1",
  "panel2": "panel2",
  "rug": "rug",
  "sofa": "sofa",
  "1": "sofa"
};
    this.labelMap = {
  "panel1": "Wallpaper Sofa Panel",
  "panel2": "Wallpaper Console Panel",
  "rug": "Rug",
  "sofa": "Sofa Fabric"
};
    this.itemLabelMap ={
  "Bloom": "Bloom Pattern",
  "Beigewheel": "Beige Wheel",
  "Sagecrane": "Sage Crane",
  "Coralmist": "Coral Mist",
  "Blushaviary": "Blush Aviary",
  "Tealaviary": "Teal Aviary",
  "Rosagrove": "Rosa Grove",
  "Lilacstone": "Lilac Stone",
  "Azura": "Azura",
  "Florawood": "Flora Wood",
  "Teal Medallion": "Teal Medallion",
  "Terracotta Medallione": "Terracotta Medallione",
  "Featherfield": "Feather Field",
  "Meadow Lace": "Meadow Lace",
  "Oroflora": "Oro Flora",
  "Aqualora": "Aqua Lora",
  "Lunara": "Lunara",
  "Arda": "Arda",
  "Rosefern": "Rose Fern",
  "Seaforest": "Sea Forest",
  "Midnightfern": "Midnight Fern",
  "Stonebloom": "Stone Bloom",
  "Kayla": "Kayla",
  "Cloudpetal": "Cloud Petal",
  "Verdanta": "Verdanta",
  "Saharine": "Saharine",
  "Ashloom": "Ash Loom",
  "Clayweave": "Clay Weave",
  "Sandvelour": "Sand Velour",
  "Skybloom": "Sky Bloom",
  "Stonegrid": "Stone Grid",
  "Terrastripe": "Terra Stripe",
  "{Petalarch}Object010": "Petalarch",
  "{Lilacstone}Walls_01.004": "Lilacstone",
  "SM_Living004": "Living Room Rug",
  "{sofa_fab}Shape25": "Grey Sofa",
  "s2": "Teal Sofa",
  "s3": "Wooden Sofa"
};
  }

  async init() {
    await this.loadCoverJson();
    await this.populateSelect();

    this.registerEvents();
    this.sceneController.setMaterialsEditable(Object.keys(this.nodes));
    this.configureMessageHandler();

    window.addEventListener("message", (event) => {
      if (event.data && event.data.type === "ANCHOR_CLICK") {
        const anchorId = event.data.payload?.anchorId;
        const tabType = event.data.payload?.tabType;

        if (tabType) {
          app.toggleTab(tabType, true);
        }

        const dropdownKey = app.anchorIdToDropdownKey[anchorId];
        if (dropdownKey && app.nodes[dropdownKey]) {
          app.elementSelector.value = dropdownKey;
          app.handleSelection({ target: app.elementSelector }, true);
          console.log(`Dropdown set via anchor click: ${dropdownKey}`);
        } else {
          console.log(`No dropdown mapping found for anchor ID: ${anchorId}`);
        }
      }
    });
  }

  configureMessageHandler() {
    const ref = this;
    window.addEventListener("message", function (event) {
      if (
        event.data &&
        event.data.type === ref.sceneController.messages.READY_FOR_EDITABLE
      ) {
        const nodeNames = Object.values(ref.nodes)
          .flatMap((entry) => entry.meshes || [])
          .map((mesh) => mesh.name);
        ref.sceneController.setNodesEditable(nodeNames);
        ref.sceneController.setCustomAnchors(ref.anchorsFromMenu);
      }
    });
  }

  async loadCoverJson() {
    try {
      const res = await fetch("interior_living_cover.json");
      const data = await res.json();

      this.anchorsFromMenu = data.extensions
        .filter((ext) => ext.trigger && ext.trigger.position)
        .map((ext) => ({
          name: ext.name,
          position: ext.trigger.position,
          type: "sphere",
          icon: /switch/i.test(ext.type) ? "question" : "info",
          radius: 0.15,
          tabType: /switch/i.test(ext.type) ? "Mesh" : "Material",
        }));

      data.extensions?.forEach((ext) => {
        if (ext.toPick || this.meshMap[ext.name]) {
          const materialNames = ext.toPick
            ? [...ext.toPick, ext.toReplace]
            : [];
          const materialObjs = materialNames.map((name) => ({
            name,
            url:
            this.materialImageMap[name]?.url ||
            "https://via.placeholder.com/100x100?text=" + encodeURIComponent(name),
            sku: this.materialImageMap[name]?.sku || null
          }));

          var findDefault = () => {
            if (this.meshMap[ext.name]) {
              return this.meshMap[ext.name].find((f) => f.default)?.name;
            }
            return "";
          };

          this.nodes[ext.name] = {
            materials: materialObjs,
            view: this.viewMap[ext.name],
            meshes: this.meshMap[ext.name] || [],
            defaultNode: findDefault(),
            defaultMaterial: ext.toReplace,
          };
        }
      });
    } catch (e) {
      console.error("Failed loading cover.json", e);
    }
  }

  async populateSelect() {
    if (!this.elementSelector) return;
    while (this.elementSelector.options.length > 1)
      this.elementSelector.remove(1);

    Object.keys(this.nodes).forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = this.labelMap[name] || name;
      this.elementSelector.appendChild(opt);
    });

    if (this.elementSelector.value !== "none") {
      this.handleSelection({ target: this.elementSelector });
    }
  }

  registerEvents() {
    window.toggleTab = (tabName) => this.toggleTab(tabName);
    window.onSelectOption = (e) => this.handleSelection(e);
    window.nodes = this.nodes;

    this.elementSelector.addEventListener("change", (e) =>
      this.handleSelection(e)
    );
  }

  toggleTab(tab, suppressGoToView = false) {
    if (!this.meshTab || !this.materialTab) return;

    const [active, inactive] =
      tab === "Mesh"
        ? [this.meshTab, this.materialTab]
        : [this.materialTab, this.meshTab];

    active.classList.add("active");
    inactive.classList.remove("active");

    if (this.elementSelector.value !== "none") {
      this.handleSelection({ target: this.elementSelector }, suppressGoToView);
    }
  }

  handleSelection(e, suppressGoToView = false) {
    const selectedKey = e.target.value;
    this.selectedOption = selectedKey;
    if (selectedKey === "none" || !this.nodes[selectedKey]) {
      this.displayManager.clear();
      return;
    }

    const selected = this.nodes[selectedKey];
    if (selected.selectedNode == undefined) {
      selected.selectedNode = selected.defaultNode;
    }

    if (!suppressGoToView && selected.view) {
      // this.sceneController.goToView(selected.view);
    }

    const isMeshTabActive = this.meshTab.classList.contains("active");
    const itemsToRender = isMeshTabActive
      ? selected.meshes ?? []
      : selected.materials ?? [];
    this.displayManager.renderItems(itemsToRender, (item) => {
      if (isMeshTabActive) {
        var meshesToHide = selected.meshes
          .filter((c) => c.name != item.name)
          .map((c) => c.name);
        this.onMeshSelected(item.name, meshesToHide);
      } else {
        this.onMaterialSelected(item);
      }
    });
  }
  onMeshSelected(mesh, meshesToHide) {
    console.log("Mesh selected:", mesh, meshesToHide);
    this.nodes[this.selectedOption].selectedNode = mesh;
    this.sceneController.showHideNode(mesh, meshesToHide);
    if (window.selectionChanged) {
      window.selectionChanged({
        type: "mesh",
        mesh,
        option: this.selectedOption,
        sceneName: "interior_living"
      });
    }
  }

  onMaterialSelected(item) {
    console.log("Material selected:", item);
    const nodeInfo = this.nodes[this.selectedOption];
    this.nodes[this.selectedOption].selectedMaterial = item.name;

    const materialMeta = this.materialImageMap[item.name] || {};
    const sku = materialMeta.sku || "N/A";

    if (window.selectionChanged) {
    window.selectionChanged({
        type: "material",
        material: item.name,
        option: this.selectedOption,
        mesh: this.nodes[this.selectedOption]?.selectedNode || null,
        sceneName: "interior_living",
        sku: sku 
    });
    }

    const node = this.nodes[this.selectedOption].selectedNode;
    this.sceneController.sendTexture(
      item.url,
      node,
      nodeInfo.defaultMaterial
    );
  }
}


// Bootstrap
const app = new App();
app.init();

// --- AI Generator Popup Integration (improved) ---
document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://127.0.0.1:8000"; // <-- use your deployed URL in prod

  const openBtn = document.getElementById("open-ai-popup");
  const popup = document.getElementById("ai-popup");
  const popupContent = popup ? popup.querySelector(".ai-popup-content") : null;
  const closeBtn = document.getElementById("ai-close");

  const captureBtn = document.getElementById("capture-scene");
  const referencePreview = document.getElementById("reference-preview");
  const targetInput = document.getElementById("target-upload");
  const promptInput = document.getElementById("ai-prompt");
  const generateBtn = document.getElementById("generate-btn");
  const downloadBtn = document.getElementById("download-btn");
  const originalImg = document.getElementById("original-img");
  const generatedImg = document.getElementById("generated-img");
  const toggle = document.getElementById("toggle-original");
  const statusEl = document.getElementById("ai-status");

  function openPopup() {
    if (!popup) return;
    popup.classList.remove("hidden");
    popup.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }
  function closePopup() {
    if (!popup) return;
    popup.classList.add("hidden");
    popup.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  if (openBtn) openBtn.addEventListener("click", openPopup);
  if (closeBtn) closeBtn.addEventListener("click", closePopup);

  // close when clicking overlay (outside the content)
  if (popup) {
    popup.addEventListener("click", (e) => {
      if (e.target === popup) closePopup();
    });
  }
  // close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePopup();
  });

  // --- captureImage message -> ask shapespark iframe to capture and respond with dataURL
  async function captureSceneScreenshot(timeoutMs = 15000) {
    const iframe = document.getElementById("video-frame");
    if (!iframe || !iframe.contentWindow) throw new Error("Shapespark iframe not found");

    return new Promise((resolve, reject) => {
      const handler = (ev) => {
        if (!ev.data) return;
        if (ev.data.type === "CAPTURE_SCENE_RESULT") {
          window.removeEventListener("message", handler);
          clearTimeout(timer);
          resolve(ev.data.image);
        } else if (ev.data.type === "CAPTURE_SCENE_ERROR") {
          window.removeEventListener("message", handler);
          clearTimeout(timer);
          reject(new Error(ev.data.message || "Capture failed"));
        }
      };
      window.addEventListener("message", handler);

      // timeout fallback
      const timer = setTimeout(() => {
        window.removeEventListener("message", handler);
        reject(new Error("Capture timed out"));
      }, timeoutMs);

      // request Shapespark to capture (Shapespark script must implement this)
      try {
        iframe.contentWindow.postMessage({ type: "CAPTURE_SCENE" }, "*");
      } catch (err) {
        clearTimeout(timer);
        window.removeEventListener("message", handler);
        reject(err);
      }
    });
  }

  function dataURLToFile(dataUrl, filename = "reference.jpg") {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }

  // helper to show spinner & disable generate button
  async function setGeneratingState(on) {
    if (!generateBtn) return;
    if (on) {
      generateBtn.disabled = true;
      generateBtn.textContent = "Generating...";
      if (!generateBtn.querySelector(".spinner")) {
        const s = document.createElement("span");
        s.className = "spinner";
        generateBtn.appendChild(s);
      }
      if (statusEl) statusEl.textContent = "Generating image, please wait...";
    } else {
      generateBtn.disabled = false;
      generateBtn.textContent = "Generate";
      const s = generateBtn.querySelector(".spinner");
      if (s) s.remove();
      if (statusEl) statusEl.textContent = "";
    }
  }

  // capture button -> get screenshot and preview
  if (captureBtn) {
    captureBtn.addEventListener("click", async () => {
      try {
        if (statusEl) statusEl.textContent = "Capturing scene…";
        captureBtn.disabled = true;
        const dataUrl = await captureSceneScreenshot();
        const file = dataURLToFile(dataUrl);
        window.referenceFile = file;
        if (referencePreview) {
          referencePreview.src = dataUrl;
          referencePreview.classList.remove("hidden");
        }
        if (statusEl) statusEl.textContent = "Captured reference image";
      } catch (err) {
        console.error("Capture failed", err);
        alert("Capture failed: " + (err.message || err));
        if (statusEl) statusEl.textContent = "Capture failed";
      } finally {
        if (captureBtn) captureBtn.disabled = false;
      }
    });
  }

  // generate -> send to FastAPI
  if (generateBtn) {
    generateBtn.addEventListener("click", async () => {
      try {
        const prompt = (promptInput && promptInput.value) ? promptInput.value.trim() : "";
        const targetFile = (targetInput && targetInput.files && targetInput.files[0]) ? targetInput.files[0] : null;
        const referenceFile = window.referenceFile || null;

        if (!prompt || !targetFile || !referenceFile) {
          return alert("Please capture the scene, upload the target image, and enter a prompt.");
        }

        await setGeneratingState(true);

        const fd = new FormData();
        fd.append("prompt", prompt);
        fd.append("target", targetFile);
        fd.append("reference", referenceFile);

        const resp = await fetch(`${API_BASE}/api/v1/generate`, { method: "POST", body: fd });
        if (!resp.ok) {
          const txt = await resp.text();
          throw new Error(txt || `HTTP ${resp.status}`);
        }
        const data = await resp.json();
        if (data.status !== "success") throw new Error(data.message || "Generation failed");

        const genUrl = `${API_BASE}${data.image_url}`;
        if (generatedImg) {
          generatedImg.src = genUrl;
          generatedImg.classList.remove("hidden");
          generatedImg.style.display = "block";
        }
        if (originalImg && targetFile) {
          originalImg.src = URL.createObjectURL(targetFile);
          originalImg.classList.remove("hidden");
          originalImg.style.display = "none"; // default show generated
        }

        // enable download button
        if (downloadBtn) {
          downloadBtn.classList.remove("hidden");
          downloadBtn.onclick = () => {
            const a = document.createElement("a");
            a.href = genUrl;
            a.download = "generated.png";
            document.body.appendChild(a);
            a.click();
            a.remove();
          };
        }

        if (statusEl) statusEl.textContent = "Image generated";
        // Ensure toggle default state shows generated
        if (toggle) toggle.checked = false;
      } catch (err) {
        console.error("Generate failed", err);
        alert("Generation failed: " + (err.message || err));
        if (statusEl) statusEl.textContent = "Generation failed";
      } finally {
        await setGeneratingState(false);
      }
    });
  }

  // toggle original vs generated
  if (toggle) {
    toggle.addEventListener("change", (e) => {
      const showOriginal = !!e.target.checked;
      if (originalImg) originalImg.style.display = showOriginal ? "block" : "none";
      if (generatedImg) generatedImg.style.display = showOriginal ? "none" : "block";
    });
  }
});

