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
        ANCHORS_FROM_MENU: 'B615910B-0253-4334-B7FD-B9CFCFD3E155',
        CUSTOM_SOFA_TEXTURE: '9BFBEC93-95BA-4CC4-996B-EB889F5C0E7C'
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
    sendSofaTexture(url, node) {
      console.log("Sending custom sofa texture", url, node);
      this.postMessage({type: this.messages.CUSTOM_SOFA_TEXTURE, url, node});
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
        "Bloom": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Bloom.webp?v=1755240214",
        "Beigewheel": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Beigewheel.webp?v=1755236747",
        "Sagecrane": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Sagecrane.webp?v=1755236747",
        "Coralmist": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Coralmist.webp?v=1755236746",
        "Blushaviary": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Blushaviary.webp?v=1755236747",
        "Tealaviary": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Tealaviary.webp?v=1755236747",
        "Rosagrove": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Rosagrove.webp?v=1755236746",
        "Petalarch": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Petalarch.webp?v=1755236747",

        "Lilacstone": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Lilacstone.webp?v=1755237068",
        "Azura": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Azura.webp?v=1755237069",
        "Florawood": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Florawood.webp?v=1755237069",
        "Teal Medallion": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Teal_Medallion.webp?v=1755237069",
        "Terracotta Medallione": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Terracotta_Medallione.webp?v=1755237069",
        "Featherfield": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Featherfield.webp?v=1755237068",
        "Meadow Lace": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Meadow_Lace.webp?v=1755237069",
        "Oroflora": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Oraflora.webp?v=1755237068",
        "Aqualora": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Aqualora.webp?v=1755237069",

        "Lunara": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Lunara.webp?v=1755236572",
        "Arda": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Arda.webp?v=1755236572",
        "Rosefern": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Rossefern.webp?v=1755236572",
        "Seaforest": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Seaforest.webp?v=1755236572",
        "Midnightfern": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Rossefern.webp?v=1755236572",
        "Stonebloom": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Stonebloom.webp?v=1755236572",
        "Kayla": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Kayla.webp?v=1755236572",
        "Cloudpetal": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Cloudpetal.webp?v=1755236572",
        "Verdanta": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Verdanta.webp?v=1755236572",
        "Saharine": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Saharine.webp?v=1755236630",

        "Ashloom": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Ashloom.webp?v=1755236402",
        "Clayweave": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Clayweave.webp?v=1755236402",
        "Sandvelour": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Sandvelour.webp?v=1755236402",
        "Skybloom": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Skybloom.webp?v=1755236402",
        "Stonegrid": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Stonegrid.webp?v=1755236400",
        "Terrastripe": "https://cdn.shopify.com/s/files/1/0579/1842/3122/files/Terrastripe.webp?v=1755236402"
        };

      this.meshMap = {
        "panel1": [
          { "name": "{Petalarch}Object010", "default": true }
        ],
        "panel2": [
          { "name": "{Lilacstone}Walls_01.004", "default": true }
        ],
        "sofa": [
          { "name": "{sofa_fab}Shape25", "default": true },
          { "name": "s2", "default": false },
          { "name": "s3", "default": false },
        ],
        "rug": [
          { "name": "SM_Living004", "default": true }
        ],
      };

      this.viewMap = {
        'panel1' : "panel1",
        'panel2' : "panel2",
        'rug' : "BEDROOM",
        'sofa' : "LIVING"
        }

      this.anchorIdToDropdownKey = {
        "panel1": "panel1",
        "panel2": "panel2",
        "rug": "rug",
        "sofa": "sofa",
      };
       this.imageUrl = this.customSofaMaterialUrl;

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
        const res = await fetch("interior_living_cover.json");
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

    toggleTab(tab, suppressGoToView = false) {
      if (!this.meshTab || !this.materialTab) return;

      const [active, inactive] = tab === "Mesh"
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
      if(selected.selectedNode == undefined) {
        selected.selectedNode = selected.defaultNode;
      }
      
      if (!suppressGoToView && selected.view) {
        // this.sceneController.goToView(selected.view);
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
        console.log(this.selectedOption, "sele")
        this.sceneController.applyMaterial(node, item.name);
    }
  }

  // Bootstrap
  const app = new App();
  app.init();
