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
        MESH_SHOW_HIDE : '980A9415-2888-4596-BDB0-37DE9CA99702',
        GOTO_VIEW : '0047F251-C4C9-4163-BD66-E78E2096AB0B',
        MATERIALS_EDITABLE : 'FC9B8633-FB7E-4CDB-B9B4-9C7402805EB8',
        NODES_EDITABLE : 'B3331D7E-5FEA-4763-959F-BB468F7A2252',
        APPLY_MATERIAL : '22D78DEB-39B2-4DB4-A560-5B0C143B02F8',
        READY_FOR_EDITABLE: '11AC52C9-D395-4B50-A0BE-B8F993218F8A',
        ANCHORS_FROM_MENU: 'B615910B-0253-4334-B7FD-B9CFCFD3E155'
      }
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
      this.postMessage({ type: this.messages.MESH_SHOW_HIDE, node, nodesTohide });
    }

    applyMaterial(node, material) {
      this.postMessage({ type: this.messages.APPLY_MATERIAL, node, material });
    }

    setCustomAnchors(anchors) {
      console.log('Sending anchors', anchors);
      this.postMessage({ type: this.messages.ANCHORS_FROM_MENU, anchors });  
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
        label.textContent = item.name || "";

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
      this.displayManager = new DisplayManager(document.getElementById("display-container"));
      this.sceneController = new SceneController(this.sceneFrame);
      this.selectedOption = '';
      this.nodes = {};
      this.anchorsFromMenu = [];
      this.materialImageMap = {
        "FAB_1": "https://img.freepik.com/free-photo/dark-green-wall_53876-90733.jpg?w=740",
        "FAB_2": "https://img.freepik.com/free-photo/minimal-stone-structure-texture_23-2149041177.jpg?w=740",
        "FAB_3": "https://img.freepik.com/premium-photo/granite-blue-tiles-that-look-like-blue_684636-3788.jpg?w=740",
        "RUG_1": "https://img.freepik.com/free-photo/fabric-texture-background_1385-1176.jpg?w=740",
        "RUG_4": "https://img.freepik.com/premium-photo/colorful-knitted-texture-fabric-stripes_127093-647.jpg?w=740",
        "Floor_2": "https://img.freepik.com/free-photo/brown-wooden-flooring-background_53876-88628.jpg?w=740",
        "Floor_9": "https://img.freepik.com/free-photo/light-wooden-floor-texture_23-2147830562.jpg?w=740",
        "Floor_11": "https://img.freepik.com/free-photo/wood-floor-texture_1194-5763.jpg?w=740",
        "Floor_5": "https://img.freepik.com/free-photo/parquet-wooden-floor-texture_1194-5515.jpg?w=740",
        "Wall_1": "https://img.freepik.com/free-photo/white-concrete-wall_53876-92803.jpg?w=740",
        "Wall_2": "https://img.freepik.com/free-photo/grey-wall-texture_53876-89721.jpg?w=740",
        "Wall_3": "https://img.freepik.com/free-photo/soft-blue-wall-background_53876-92804.jpg?w=740",
        "Wall_4": "https://img.freepik.com/free-photo/stone-wall-background_53876-91614.jpg?w=740",
        "Wall_5": "https://img.freepik.com/free-photo/grunge-concrete-textured-wall_53876-92970.jpg?w=740",
        "Wall_6": "https://img.freepik.com/free-photo/white-brick-wall_53876-63545.jpg?w=740",
        "Wall_7": "https://img.freepik.com/free-photo/light-gray-textured-wall_53876-88679.jpg?w=740",
        "Material #2147482698": "https://www.shutterstock.com/shutterstock/photos/2418670155/display_1500/stock-vector-persian-carpet-with-geometric-ornament-red-black-beige-and-white-colors-vector-illustration-2418670155.jpg?w=740",
        "Material #2147482699": "https://www.shutterstock.com/shutterstock/photos/2304184851/display_1500/stock-vector-colorful-ornamental-vector-design-for-rug-tapis-yoga-mat-geometric-ethnic-clipart-arabian-2304184851.jpg?w=740"
      };
      //this.materials = this.getSampleMaterials(); // Use your actual data source if needed
      this.meshMap = {
        "LONG SOFA MAT": [
          { "name": "ALORA_SOFA", "url": "https://img.freepik.com/free-psd/midcentury-modern-grey-sofa-with-wooden-frame_632498-25556.jpg?w=740" },
          { "name": "sofa", "default": true, "url": "https://img.freepik.com/free-psd/teal-velvet-sofa-with-gold-accents-elegant-modern-living-room-furniture_191095-80919.jpg?w=740" },
          { "name": "Vernon Sofa", "url": "https://img.freepik.com/free-psd/modern-wooden-sofa-with-natureinspired-design_191095-83780.jpg?w=740" }
        ],
        "FLOOR": [
          { "name": "Floor_Living_003", "default": true }
        ],
        "DINING FLOOR": [
          { "name": "Floor_Dining_002", "default": true }
        ],
        "BEDROOM FLOOR": [
          { "name": "Floor_Bed_001", "default": true }
        ],
        "LIVING CARPET": [
          { "name": "Plane001", "default": true }
        ],
        "DINING CARPET": [
          { "name": "Plane002", "default": true }
        ],
        "BEDROOM CARPET": [
          { "name": "Plane003", "default": true }
        ],
        "LIVING WALL": [
          { "name": "Liv_wall_001", "default": true }
        ],
        "DINING WALL": [
          { "name": "Din_wall_004", "default": true }
        ],
        "BEDROOM WALL": [
          { "name": "Bed_wall_002", "default": true }
        ],
        "ARM CHAIRS": [
          { name: "CHAIR1", default: true, url : "https://www.shutterstock.com/shutterstock/photos/1687941274/display_1500/stock-photo-dark-blue-navy-sapphire-color-armchair-modern-designer-chair-on-white-background-textile-chair-1687941274.jpg?w=740" },
          { name: "CHAIR2", url: "https://www.shutterstock.com/shutterstock/photos/2250640895/display_1500/stock-photo-armchair-no-background-white-background-blue-turquoise-blue-aqua-beautiful-vintage-elegant-luxury-2250640895.jpg?w=740" },
          { name: "CHAIR3", url: "https://www.shutterstock.com/shutterstock/photos/2567680761/display_1500/stock-photo-modern-grey-fabric-armchair-isolated-on-white-background-or-transparent-with-wooden-legs-clipping-2567680761.jpg?w=740" }
        ]
      };

      this.viewMap = {
        'FLOOR' : "LIVING",
        'DINING FLOOR' : "DINING",
        'BEDROOM FLOOR' : "BEDROOM",
        'LIVING CARPET' : "LIVING",
        'LONG SOFA MAT' : "LIVING",
        'DINING CARPET' : "DINING",
        'BEDROOM CARPET' :  "BEDROOM",
        'LIVING WALL' : "LIVING",
        'DINING WALL' : "DINING",
        'BEDROOM WALL' : "BEDROOM",
        'ARM CHAIRS' : "LIVING"
        }

      this.anchorIdToDropdownKey = {
        "SOFA LONG": "LONG SOFA MAT",
        "ARM CHAIRS": "ARM CHAIRS",
        "FLOOR": "FLOOR",
        "DINING CARPET": "DINING CARPET",
        "DINING WALL": "DINING WALL",
        "LIVING WALL": "LIVING WALL",
        "LONG SOFA MAT": "LONG SOFA MAT",
        "LIVING CARPET": "LIVING CARPET",
        "DINING FLOOR": "DINING FLOOR",
        "BEDROOM CARPET": "BEDROOM CARPET",
        "BEDROOM FLOOR": "BEDROOM FLOOR",
        "BEDROOM WALL": "BEDROOM WALL"
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
            app.toggleTab(tabType); 
          }

          const dropdownKey = app.anchorIdToDropdownKey[anchorId];
          if (dropdownKey && app.nodes[dropdownKey]) {
            app.elementSelector.value = dropdownKey;
            const e = new Event("change", { bubbles: true });
            app.elementSelector.dispatchEvent(e);
            console.log(`Dropdown set via anchor click: ${dropdownKey}`);
          } else {
            console.log(`No dropdown mapping found for anchor ID: ${anchorId}`);
          }
        }
      });
    }

    configureMessageHandler(){
      const ref = this;
      window.addEventListener('message', function(event) {
        if (event.data && event.data.type === ref.sceneController.messages.READY_FOR_EDITABLE) {
          const nodeNames = Object.values(ref.nodes).flatMap(entry => entry.meshes || []).map(mesh => mesh.name);
          ref.sceneController.setNodesEditable(nodeNames);
          ref.sceneController.setCustomAnchors(ref.anchorsFromMenu);
        }
      });
    } 

    async loadCoverJson() {
      try {
        const res = await fetch("menu-cover.json");
        const data = await res.json();

        this.anchorsFromMenu = data.extensions
          .filter(ext => ext.trigger && ext.trigger.position)
          .map(ext => ({
            name: ext.name,
            position: ext.trigger.position,
            type: 'sphere',
            icon: /switch/i.test(ext.type) ? 'question': 'info',
            radius: 0.15,
            tabType: /switch/i.test(ext.type) ? "Mesh" : "Material"
        }));

        data.extensions?.forEach((ext) => {
          if (ext.toPick || this.meshMap[ext.name]) {
            const materialNames = ext.toPick ? [...ext.toPick, ext.toReplace] : [];
            const materialObjs = materialNames.map(name => ({
              name,
              url: this.materialImageMap[name] || "https://via.placeholder.com/100x100?text=" + encodeURIComponent(name)
            }));
            
            var findDefault = () => {
              if(this.meshMap[ext.name]){
                return this.meshMap[ext.name].find(f=> f.default)?.name  
              }
              return '';
            }

            this.nodes[ext.name] = {
              materials: materialObjs,
              view: this.viewMap[ext.name],
              meshes: this.meshMap[ext.name] || [],
              defaultNode : findDefault()
            };
          }
        });
      } catch (e) {
        console.error("Failed loading cover.json", e);
      }
    }

    async populateSelect() {
      if (!this.elementSelector) return;
      while (this.elementSelector.options.length > 1) this.elementSelector.remove(1);

      Object.keys(this.nodes).forEach((name) => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
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

      this.elementSelector.addEventListener("change", (e) => this.handleSelection(e));
    }

    toggleTab(tab) {
      if (!this.meshTab || !this.materialTab) return;

      const [active, inactive] = tab === "Mesh"
        ? [this.meshTab, this.materialTab]
        : [this.materialTab, this.meshTab];

      active.classList.add("active");
      inactive.classList.remove("active");

      if (this.elementSelector.value !== "none") {
        this.handleSelection({ target: this.elementSelector });
      }
    }

    handleSelection(e) {
      const selectedKey = e.target.value;
      this.selectedOption = selectedKey;
      if (selectedKey === "none" || !this.nodes[selectedKey]) {
        this.displayManager.clear();
        return;
      }

      const selected = this.nodes[selectedKey];
      if(selected.selectedNode == undefined) {
        selected.selectedNode = selected.defaultNode;
      }
      
      if (selected.view) {
        this.sceneController.goToView(selected.view);
      }
      
      const isMeshTabActive = this.meshTab.classList.contains("active");
      const itemsToRender = isMeshTabActive ? selected.meshes ?? [] : selected.materials ?? [];
      this.displayManager.renderItems(itemsToRender, (item) => {
        if (isMeshTabActive) {
          var meshesToHide = selected.meshes.filter(c=> c.name != item.name).map(c=> c.name);
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
    }

    onMaterialSelected(item) {
      console.log("Material selected:", item);
      this.nodes[this.selectedOption].selectedMaterial = item.name;
      const node = this.nodes[this.selectedOption].selectedNode;
      this.sceneController.applyMaterial(node, item.name);
    }
  }

  // Bootstrap
  const app = new App();
  app.init();
