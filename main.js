// WorkData
const WorkData = {
    node_tag_set: [],
    edge_tag_set: [],
    node_dict: {
        // "node_name": {
        //     "node_tags": "tag1 tag2",
        //     "position": {},
        // }
    },
    edge_list: [
        // {
        //     "edge_id": 0,
        //     "source": "node_name",
        //     "target": "node_name",
        //     "edge_tag": "edge_tag",
        //     "pathpoint_list": [], // 每个边至少有一个pathpoint，即箭头
        //     "attach_index": 0, // 标签所在的segment是第几个
        // }
    ],
    checkName: (new_name, target_list) => {
        // [name].[number]
        let checkedName = new_name
        while (target_list.includes(checkedName)) {
            const name_strings = checkedName.split(".")
            if (name_strings.length == 1) {
                checkedName = `${checkedName}.1`
            } else {
                const n = Number(name_strings[1]) + 1
                checkedName = `${name_strings[0]}.${n}`
            }
        }
        return checkedName
    },
    addNodeTag: (tag_name) => {
        let name = "新标签"
        if (tag_name != null && tag_name.length > 0) {
            name = WorkData.checkName(tag_name, WorkData.node_tag_set)
        }
        WorkData.node_tag_set.push(name)
        return name
    },
    deleteNodeTag: (tag_name) => {
        let result = false
        for (let i = 0; i < WorkData.node_tag_set.length; i++) {
            const name = WorkData.node_tag_set[i]
            if (name == tag_name) {
                WorkData.node_tag_set.splice(i, 1)
                result = true
                break
            }
        }
        for (const key in WorkData.node_dict) {
            const tags = WorkData.node_dict[key].node_tags.split(" ")
            if (tags.includes(tag_name)) {
                tags.splice(tags.indexOf(tag_name), 1)
                WorkData.node_dict[key].node_tags = tags.join(" ")
            }
        }
        return result
    },
    renameNodeTag: (tag_name, new_name) => {
        let name = "新标签"
        if (new_name != null && new_name.length > 0) {
            name = new_name
        }
        fixed_name = WorkData.checkName(name, WorkData.node_tag_set)
        for (let i = 0; i < WorkData.node_tag_set.length; i++) {
            const name = WorkData.node_tag_set[i]
            if (name == tag_name) {
                WorkData.node_tag_set[i] = fixed_name
                break
            }
        }
        for (const key in WorkData.node_dict) {
            const tags = WorkData.node_dict[key].node_tags.split(" ")
            if (tags.includes(tag_name)) {
                tags.splice(tags.indexOf(tag_name), 1, fixed_name)
                WorkData.node_dict[key].node_tags = tags.join(" ")
            }
        }
        return fixed_name
    },
    addEdgeTag: (tag_name) => {
        const name = WorkData.checkName(tag_name, WorkData.edge_tag_set)
        WorkData.edge_tag_set.push(name)
        return name
    },
    deleteEdgeTag: (tag_name) => {
        for (let i = 0; i < WorkData.edge_tag_set.length; i++) {
            const name = WorkData.edge_tag_set[i]
            if (name == tag_name) {
                WorkData.edge_tag_set.splice(i, 1)
                break
            }
        }
    },
    renameEdgeTag: (tag_name, new_name) => {
        const name = WorkData.checkName(new_name, WorkData.edge_tag_set)
        WorkData.edge_tag_set[WorkData.edge_tag_set.indexOf(tag_name)] = name
        for (let i = 0; i < WorkData.edge_list.length; i++) {
            const edge = WorkData.edge_list[i];
            if (edge.edge_tag == tag_name) {
                edge.edge_tag = name
            }
        }
        return name
    },
    addNode: (name, tags, position) => {
        const node_name_set = Object.keys(WorkData.node_dict)
        const fixed_name = WorkData.checkName(name == null ? "新节点" : name, node_name_set)
        WorkData.node_dict[fixed_name] = { node_tags: tags, position: position }
        return fixed_name
    },
    deleteNode: (name) => {
        let result = false
        for (const node_name in WorkData.node_dict) {
            if (node_name == name) {
                delete WorkData.node_dict[node_name]
                result = true
                break
            }
        }
        for (const edge of WorkData.edge_list) {
            if (edge == null) {
                continue
            }
            if (edge.target == name) {
                WorkData.setEdgeTarget(edge.edge_id, null)
            }
        }
        return result
    },
    renameNode: (node_name, new_name) => {
        const fixed_name = WorkData.checkName(new_name, Object.keys(WorkData.node_dict))
        console.log(fixed_name)
        for (const name in WorkData.node_dict) {
            if (name == node_name) {
                console.log(name)
                const node = WorkData.node_dict[name]
                WorkData.addNode(fixed_name, node.node_tags, node.position)
                if (WorkData.deleteNode(name)) {
                    console.log("已删除旧名称的节点")
                }
                break
            }
        }
        for (const edge of WorkData.edge_list) {
            if (edge == null) {
                continue
            }
            if (edge.source == node_name) {
                edge.source = fixed_name
            }
            if (edge.target == node_name) {
                console.log("来ala")
                edge.target = fixed_name
            }
        }
        return fixed_name
    },
    attachNodeTag: (node_name, tag_name) => {
        let result = false
        if (Object.keys(WorkData.node_dict).includes(node_name) && WorkData.node_tag_set.includes(tag_name)) {
            const tag_list = WorkData.node_dict[node_name].node_tags == "" ? [] : WorkData.node_dict[node_name].node_tags.split(" ")
            if (tag_list.includes(tag_name)) {
            } else {
                tag_list.push(tag_name)
                WorkData.node_dict[node_name].node_tags = tag_list.join(" ")
                result = true
            }
        }
        return result
    },
    detachNodeTag: (node_name, tag_name) => {
        let result = false
        if (Object.keys(WorkData.node_dict).includes(node_name) && WorkData.node_tag_set.includes(tag_name)) {
            const tag_list = WorkData.node_dict[node_name].node_tags.split(" ")
            if (tag_list.includes(tag_name)) {
                tag_list.splice(tag_list.indexOf(tag_name), 1)
                WorkData.node_dict[node_name].node_tags = tag_list.join(" ")
                result = true
            }
        }
        return result
    },
    addEdge: (source, target, tag) => {
        const edge_id = WorkData.edge_list.length
        WorkData.edge_list.push({
            edge_id: edge_id,
            source: source,
            target: target,
            edge_tag: tag,
            pathpoint_list: [{ x: 0, y: 0 }], // target_arrow是最后一个pathpoint
            attach_index: 0,
        })
        return edge_id // 返回id
    },
    deleteEdge: (id) => {
        if (WorkData.edge_list[id] != null) {
            WorkData.edge_list[id] = null
            const edge_list = []
            for (let i = 0; i < WorkData.edge_list.length; i++) {
                const edge = WorkData.edge_list[i];
                if (edge == null) {
                    continue
                }
                if (i >= id) {
                    edge.edge_id -= 1
                }
                if (edge != null) {
                    edge_list.push(edge)
                }
            }
            WorkData.edge_list = edge_list
            return true
        } else {
            return false
        }
    },
    setEdgeSource: (id, node_name) => {
        let result = false
        if (WorkData.node_dict[node_name] != null) {
            WorkData.edge_list[id].source = node_name
            result = true
        }
        return result
    },
    setEdgeTarget: (id, node_name) => {
        let result = false
        if (node_name == null) {
            WorkData.edge_list[id].target = null
            result = true
        } else if (WorkData.node_dict[node_name] != null) {
            WorkData.edge_list[id].target = node_name
            result = true
        }
        return result
    },
    updateEdgeTag: (id, tag_name) => {
        let result = false
        if (WorkData.edge_tag_set.includes(tag_name)) {
            WorkData.edge_list[id].edge_tag = tag_name
            result = true
        }
        return result
    },
    // 好像是在逻辑检查方面有些问题但先不管了
}
// GuiComponents
// TODO 创建操作提示框
const MainArea = document.querySelector("#main_area")
InitMainArea: {
    MainArea.ondragover = (e) => {
        e.preventDefault()
    }
    MainArea.ondrop = (e) => {
        const dropData = e.dataTransfer.getData("text/plain").split(":")
        Scene.stage.setPointersPositions(e)
        const position = Scene.stage.getPointerPosition()
        // const position = { x: e.clientX, y: e.clientY }
        if (dropData.length == 2) {
            if (dropData[0] == "node_tag") {
                Scene.dropNodeTag(position, dropData[1])
            } else if (dropData[0] == "edge_tag") {
                // Scene.dropEdgeTag(position, dropData[1])
            }
        }
    }
    MainArea.promptName = (hint, space_holder) => {
        let name = prompt(hint, space_holder)
        if (name != null && name.length > 0) {
            if (name.includes(".")) {
                alert("请不要包含特殊字符")
                return null
            } else {
                return name
            }
        }
    }
}
const NodeTagSet = document.querySelector("#node_tag_set_container")
InitNodeTagSet: {
    NodeTagSet.addButton = document.querySelector("#create_node_tag_button")
    NodeTagSet.elements = []
    NodeTagSet.addButton.onclick = (e) => {
        let name = MainArea.promptName("请输入标签名，重复的名称会被加上后缀：", "新标签")
        if (name != null) {
            NodeTagSet.addNodeTag(name)
        }
    }
    NodeTagSet.createNodeTag = (tag_name) => {
        const node_tag = document.createElement("div")
        node_tag.className = "tag_option"
        node_tag.checkbox = document.createElement("input")
        node_tag.checkbox.type = "checkbox"
        node_tag.checkbox.id = "node_tag_" + tag_name + "_checkbox"

        node_tag.label = document.createElement("label")
        node_tag.label.setAttribute("for", node_tag.checkbox.id)
        node_tag.label.innerText = tag_name
        node_tag.label.draggable = "true"
        node_tag.label.drag_hovering = null
        node_tag.label.ondragstart = (e) => {
            e.dataTransfer.setData("text/plain", `node_tag:${tag_name}`)
        }
        node_tag.label.ondrag = (e) => {
            Scene.stage.setPointersPositions(e)
            const inter_shape = Scene.node_layer.getIntersection(Scene.stage.getPointerPosition())
            if (inter_shape == null) {
                if (node_tag.label.drag_hovering != null) {
                    node_tag.label.drag_hovering.rect.stroke("#fff")
                }
                node_tag.label.drag_hovering = null
            } else {
                let node_shape = inter_shape.parent
                while (node_shape.node_name == null) {
                    node_shape = node_shape.parent
                }
                node_tag.label.drag_hovering = node_shape
                node_shape.rect.stroke(node_shape.rect.fill())
            }
        }
        node_tag.rename_button = document.createElement("button")
        node_tag.rename_button.innerText = "重命名"
        node_tag.rename_button.onclick = (e) => {
            let name = Main.promptName("请输入标签名，重复的名称会被加上后缀：", node_tag.label.innerText.split(".")[0])
            if (name != null) {
                NodeTagSet.renameNodeTag(node_tag.label.innerText, name)
            }
        }
        node_tag.delete_button = document.createElement("button")
        node_tag.delete_button.innerText = "删除"
        node_tag.delete_button.onclick = (e) => {
            if (confirm(`确认删除"${node_tag.label.innerText}"?`)) {
                NodeTagSet.deleteNodeTag(node_tag.label.innerText)
            }
        }
        node_tag.append(node_tag.checkbox, node_tag.label, node_tag.rename_button, node_tag.delete_button)
        return node_tag
    }
    NodeTagSet.addNodeTag = (tag_name) => {
        tag_name = WorkData.addNodeTag(tag_name)
        const node_tag = NodeTagSet.createNodeTag(tag_name)
        NodeTagSet.append(node_tag)
        NodeTagSet.elements.push(node_tag)
    }
    NodeTagSet.deleteNodeTag = (tag_name) => {
        let result = false
        for (let i = 0; i < NodeTagSet.elements.length; i++) {
            const node_tag = NodeTagSet.elements[i];
            if (node_tag.label.innerText == tag_name) {
                result = WorkData.deleteNodeTag(tag_name)
                node_tag.remove()
                NodeTagSet.elements.splice(i, 1)
                break
            }
        }
        if (result == true) {
            for (const node_shape of Scene.node_layer.children) {
                Node.removeTag(node_shape, tag_name)
            }
        }
    }
    NodeTagSet.renameNodeTag = (tag_name, new_name) => {
        if (new_name != null && tag_name.length > 0) {
            const fixed_name = WorkData.renameNodeTag(tag_name, new_name)
            for (let i = 0; i < NodeTagSet.elements.length; i++) {
                const node_tag = NodeTagSet.elements[i];
                if (node_tag.label.innerText == tag_name) {
                    const new_node_tag = NodeTagSet.createNodeTag(fixed_name)
                    NodeTagSet.insertBefore(new_node_tag, node_tag)
                    new_node_tag.checkbox.checked = node_tag.checkbox.checked
                    node_tag.remove()
                    NodeTagSet.elements.splice(i, 1, new_node_tag)
                    break
                }
            }
            for (const node_shape of Scene.node_layer.children) {
                Node.renameTag(node_shape, tag_name, fixed_name)
            }
        }
    }
    NodeTagSet.getSelectedNodeTags = () => {
        const tag_list = []
        for (const node_tag of NodeTagSet.elements) {
            if (node_tag.checkbox.checked) {
                tag_list.push(node_tag.label.innerText)
            }
        }
        return tag_list.join(" ")
    }
    NodeTagSet.onmouseenter = (e) => {
        ToolSet.setTip("创建节点时会自动附带勾选的标签\n拖拽标签名: 可直接拖拽到节点上")
    }
}
const EdgeTagSet = document.querySelector("#edge_tag_set_container")
InitEdgeTagSet: {
    EdgeTagSet.addButton = document.querySelector("#create_edge_tag_button")
    EdgeTagSet.addButton.onclick = (e) => {
        const name = MainArea.promptName("请输入标签名: ", "新标签")
        if (name != null) {
            EdgeTagSet.addEdgeTag(name)
        }
    }
    EdgeTagSet.elements = []
    EdgeTagSet.createEdgeTag = (tag_name) => {
        const edge_tag = document.createElement("div")
        edge_tag.className = "tag_option"
        edge_tag.radio = document.createElement("input")
        edge_tag.radio.type = "radio"
        edge_tag.radio.name = "current_edge_tag"
        edge_tag.radio.id = "edge_tag" + tag_name + "_radio"
        edge_tag.label = document.createElement("label")
        edge_tag.label.setAttribute("for", edge_tag.radio.id)
        edge_tag.label.innerText = tag_name
        edge_tag.label.draggable = "true"
        edge_tag.label.drag_hovering = null
        edge_tag.label.ondragstart = (e) => {
            e.dataTransfer.setData("text/plain", `edge_tag:${tag_name}`)
        }
        edge_tag.label.ondrag = (e) => {
            Scene.stage.setPointersPositions(e)
            const position = Scene.stage.getPointerPosition()
            // console.log(position, Util.clientToWorld({ x: e.clientX, y: e.clientY }))
            const inter_shape = Scene.edge_layer.getIntersection(position)
            if (inter_shape == null) {
                if (edge_tag.label.drag_hovering != null) {
                    edge_tag.label.drag_hovering.stroke("white")
                    edge_tag.label.drag_hovering = null
                }
            } else if (inter_shape.path_point != null) { // 用是否有path_point属性来判断是非为segment
                edge_tag.label.drag_hovering = inter_shape
                inter_shape.stroke("green")
            }
        }
        edge_tag.label.ondragend = (e) => {
            if (edge_tag.label.drag_hovering != null) {
                Edge.attachTag(edge_tag.label.drag_hovering.edge_shape, tag_name, edge_tag.label.drag_hovering)
            }
        }
        edge_tag.rename_button = document.createElement("button")
        edge_tag.rename_button.innerText = "重命名"
        edge_tag.rename_button.onclick = (e) => {
            const name = MainArea.promptName("请输入标签名: ", edge_tag.label.innerText.split(".")[0])
            if (name != null) {
                EdgeTagSet.renameEdgeTag(edge_tag.label.innerText, name)
            }
        }
        edge_tag.delete_button = document.createElement("button")
        edge_tag.delete_button.innerText = "删除"
        edge_tag.delete_button.onclick = (e) => {
            if (confirm(`确定删除"${edge_tag.label.innerText}"?`)) {
                EdgeTagSet.deleteEdgeTag(edge_tag.label.innerText)
            }
        }
        edge_tag.append(edge_tag.radio, edge_tag.label, edge_tag.rename_button, edge_tag.delete_button)
        return edge_tag
    }
    EdgeTagSet.addEdgeTag = (tag_name) => {
        tag_name = WorkData.addEdgeTag(tag_name)
        const edge_tag = EdgeTagSet.createEdgeTag(tag_name)
        EdgeTagSet.append(edge_tag)
        EdgeTagSet.elements.push(edge_tag)
        edge_tag.label.click()
    }
    EdgeTagSet.deleteEdgeTag = (tag_name) => {
        for (let i = 0; i < EdgeTagSet.elements.length; i++) {
            const edge_tag = EdgeTagSet.elements[i];
            if (edge_tag.label.innerText == tag_name) {
                WorkData.deleteEdgeTag(tag_name)
                edge_tag.remove()
                EdgeTagSet.elements.splice(i, 1)
                break
            }
        }
    }
    EdgeTagSet.renameEdgeTag = (tag_name, new_name) => {
        if (new_name != null && tag_name.length > 0) {
            const name = WorkData.renameEdgeTag(tag_name, new_name)
            for (let i = 0; i < EdgeTagSet.elements.length; i++) {
                const edge_tag = EdgeTagSet.elements[i];
                if (edge_tag.label.innerText == tag_name) {
                    const new_edge_tag = EdgeTagSet.createEdgeTag(name)
                    EdgeTagSet.insertBefore(new_edge_tag, edge_tag)
                    edge_tag.remove()
                    new_edge_tag.radio.checked = true
                    EdgeTagSet.elements.splice(i, 1, new_edge_tag)
                    break
                }
            }
            for (const edge_shape of Scene.edge_layer.children) {
                if (edge_shape.edge_tag.text.text() == tag_name) {
                    edge_shape.edge_tag.setInnerText(name)
                    Edge.refresh(edge_shape)
                }
            }
        }
    }
    EdgeTagSet.getSelectedEdgeTag = () => {
        for (const edge_tag of EdgeTagSet.elements) {
            if (edge_tag.radio.checked) {
                return edge_tag.label.innerText
            }
        }
    }
    EdgeTagSet.onmouseenter = (e) => {
        ToolSet.setTip("创建边时会自动设置为选中的信号\n拖拽标签名: 可直接拖拽到同一条边的另一个线段上")
    }
}
const ToolSet = document.querySelector("#tool_set_container")
InitToolSet: {
    ToolSet.saveButton = document.querySelector("#tool_save_project")
    ToolSet.saveButton.onclick = (e) => {
        ToolSet.saveProject()
    }
    ToolSet.loadButton = document.querySelector("#tool_load_project")
    ToolSet.loadButton.onclick = (e) => {
        const upload = document.createElement("input")
        upload.type = "file"
        upload.onchange = (e) => {
            const reader = new FileReader()
            reader.readAsText(upload.files[0])
            reader.onload = (e) => {
                Scene.stage.setPointersPositions(e)
                const project = JSON.parse(e.target.result)
                ToolSet.loadProject(project)
            }
        }
        upload.click()
    }
    ToolSet.saveProject = () => {
        const name = MainArea.promptName("请输入工程名：", "工程1")
        const content = JSON.stringify(WorkData, null, 4)
        console.log(content)
        if (name != null && name.length > 0) {
            const arraybuffer = new TextEncoder().encode(content).buffer;
            const blob = new Blob([arraybuffer], { type: 'text/plain;charset=utf-8;base64' });
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = (event) => {
                const a = document.createElement('a');
                a.href = event.target.result;
                console.log(event.target.result)
                a.download = `${name.length > 0 ? name : "tmp"}.json`;
                a.click();
            };
        }
    }
    ToolSet.loadProject = (project) => {
        // console.log("正在加载工程: ", project)
        // 清理当前工程
        {
            while (Scene.node_layer.children.length > 0) {
                Scene.deleteNode(Scene.node_layer.children[0].node_name)
            }
            while (NodeTagSet.elements.length > 0) {
                NodeTagSet.deleteNodeTag(NodeTagSet.elements[0].label.innerText)
            }
            while (EdgeTagSet.elements.length > 0) {
                EdgeTagSet.deleteEdgeTag(EdgeTagSet.elements[0].label.innerText)
            }
            console.log("已清理：", WorkData)
        }
        // 添加节点标签和边标签
        {
            for (const tag_name of project.node_tag_set) {
                NodeTagSet.addNodeTag(tag_name)
            }
            for (const tag_name of project.edge_tag_set) {
                EdgeTagSet.addEdgeTag(tag_name)
            }
        }
        // 创建节点并附加标签
        {
            for (const node_name in project.node_dict) {
                const node = project.node_dict[node_name]
                const node_shape = Scene.addNode(node_name, node.position)
                for (const tag_name of node.node_tags.split(" ")) {
                    Node.addTag(node_shape, tag_name)
                }
            }
        }
        // 创建和同步边
        {
            for (const edge of project.edge_list) {
                const edge_shape = Scene.addEdge(Node.getByName(edge.source), edge.edge_tag)
                edge_shape.target_arrow.stopDrag()
                // 同步箭头和路径点
                edge_shape.target_arrow.position(edge.pathpoint_list[edge.pathpoint_list.length - 1])
                for (let i = edge.pathpoint_list.length - 2; i >= 0; i--) {
                    const position = edge.pathpoint_list[i];
                    const point_shape = Edge.addPathpoint(edge_shape, edge_shape.first_segment)
                    point_shape.stopDrag()
                    point_shape.position(position)
                }
                edge_shape.attach_index = edge.attach_index
                edge_shape.edge_tag.startDrag()
                edge_shape.edge_tag.stopDrag()
                Edge.refresh(edge_shape)
                Edge.setTarget(edge_shape, Node.getByName(edge.target))
            }
        }
        // 重置摄像机位置
        {
            Scene.stage.position({ x: 0, y: 0 })
            Scene.stage.scale({ x: 1, y: 1 })
        }
    }
    ToolSet.tool_tip = document.querySelector("#tool_tip")
    ToolSet.setTip = (text) => {
        ToolSet.tool_tip.innerText = text
    }
}
// KonvaComponents
const Util = {
    createLabel: (name) => {
        const group = new Konva.Group()
        group.text = new Konva.Text({ x: 1, y: 2, text: name, fontSize: 20, fill: "#fff" })
        group.rect = new Konva.Rect({
            x: 0, y: 0,
            width: group.text.width() + 2,
            height: group.text.height() + 2,
            fill: "#444", stroke: "#fff",
            strokeWidth: 1,
        })
        group.setInnerText = (text) => {
            group.text.text(text)
            group.rect.width(group.text.width())
        }
        group.on("mouseenter", (e) => {
            group.rect.fill("#888")
        })
        group.on("mouseleave", (e) => {
            group.rect.fill("#444")
        })
        group.add(group.rect, group.text)
        return group
    },
    createRemoveButton: (position) => {
        const group = new Konva.Circle({
            x: position.x, y: position.y,
            radius: 10,
            fill: "#ff0",
            visible: false,
        })
        group.on("mouseenter", (e) => {
            group.fill("#f00")
        })
        group.on("mouseleave", (e) => {
            group.fill("#ff0")
        })
        return group
    },
    clientToWorld: (position) => {
        const scale = Scene.stage.scaleX()
        const worldPosition = {
            x: (position.x - Scene.stage.x()) / scale,
            y: (position.y - Scene.stage.y()) / scale,
        }
        return worldPosition
    },
    zoom: (deltaY, scaleBy = 1.2) => {
        // const scaleBy = 1.2
        const oldScale = Scene.stage.scaleX();
        const pointer = Scene.stage.getPointerPosition();
        // const mousePointTo = {
        //     x: (pointer.x - Scene.stage.x()) / oldScale,
        //     y: (pointer.y - Scene.stage.y()) / oldScale,
        // };
        const mousePointTo = Util.clientToWorld(Scene.stage.getPointerPosition())
        const newScale =
            deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
        Scene.stage.scale({ x: newScale, y: newScale });
        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        Scene.stage.position(newPos);
    },
    belowLine: (point, p1, p2) => {
        // 给定一个点point和直线上的两个点p1p2，判断该点在不在直线下方
        // 设直线一般式为 Ax + By + C = 0
        const A = p2.y - p1.y
        const B = p1.x - p2.x
        const C = (p2.x * p1.y) - (p1.x * p2.y)
        // 将 point.x 代入 直线方程，得到直线在point.x处的y值
        const yP = (A * point.x + C) / (-B)
        return point.y - yP > 0
    },
}
const Node = {
    create: (node_name, position) => {
        const group = new Konva.Group({
            x: position.x, y: position.y,
            draggable: true
        })
        group.label = Util.createLabel(node_name)
        group.label.on("dblclick", (e) => {
            const name = MainArea.promptName("重命名节点：", group.label.text.text().split(".")[0])
            if (name != null) {
                const fixed_name = WorkData.renameNode(node_name, name)
                group.node_name = fixed_name
                group.label.setInnerText(fixed_name)
                Node.refresh(group)
            }
        })
        group.node_name = node_name
        group.node_tags = ""
        group.emitting_edge = false
        group.tags = new Konva.Group({
            y: 32
        })
        group.rect = new Konva.Rect({
            width: 100, height: 100,
            fill: Konva.Util.getRandomColor(),
            stroke: "#fff",
            strokeWidth: 1,
        })
        group.rect.on("click", (e) => {
            if (!group.emitting_edge) {
                group.rect.stroke(group.rect.fill())
                group.emitting_edge = true
            }
        })
        group.remove_button = Util.createRemoveButton({ x: 100, y: 0 })
        group.remove_button.on("click", (e) => {
            if (confirm(`确定删除节点"${group.node_name}"?`)) {
                Scene.deleteNode(group.node_name)
            }
        })
        group.on("mousedown", (e) => {
            if (group.emitting_edge) {
                const edge_tag = EdgeTagSet.getSelectedEdgeTag()
                Scene.addEdge(group, edge_tag)
                group.emitting_edge = false
                // group.rect.stroke("#fff")
            }
        })
        group.on("mouseenter", (e) => {
            group.remove_button.visible(true)
            ToolSet.setTip("双击节点名: 重命名节点\n点击右上圆形按钮: 删除节点\n可从侧栏中拖拽节点标签至此\n可将该节点内标签拖拽到空白处来删除")
        })
        group.on("mouseleave", (e) => {
            group.remove_button.visible(false)
            group.emitting_edge = false
            group.rect.stroke("#fff")
        })
        group.on("dragmove", (e) => {
            for (const edge_shape of Scene.edge_layer.children) {
                if (edge_shape.source_node == group || edge_shape.target_node == group) {
                    const scale = Scene.stage.scaleX()
                    const movement = { x: e.evt.movementX / scale, y: e.evt.movementY / scale }
                    if (edge_shape.segment_count > 2) {
                        if (edge_shape.source_node == group) {
                            edge_shape.first_segment.path_point.move(movement)
                        }
                        if (edge_shape.target_node == group) {
                            let segment = edge_shape.first_segment
                            while (segment.suffix != null) {
                                segment = segment.suffix
                            }
                            segment.prefix.path_point.move(movement)
                        }
                    }
                    Edge.setTarget(edge_shape, edge_shape.target_node)
                    Edge.refresh(edge_shape)
                }
            }
            WorkData.node_dict[group.node_name].position = group.position()
        })
        group.on("click", (e) => { })
        group.add(group.rect, group.label, group.remove_button, group.tags)
        return group
    },
    getByName: (node_name) => {
        for (const node_shape of Scene.node_layer.children) {
            if (node_name == node_shape.node_name) {
                return node_shape
            }
        }
        return null
    },
    refresh: (node_shape) => {
        let width = node_shape.label.text.width() + 10
        for (let i = 0; i < node_shape.tags.children.length; i++) {
            const child = node_shape.tags.children[i];
            if (child.text.width() > width) {
                width = child.text.width() + 2 + 8
            }
            child.x(0)
            child.y(32 * (i))
        }
        node_shape.label.rect.width(width)
        node_shape.label.text.x((width - node_shape.label.text.width()) / 2)
        node_shape.remove_button.x(width)
        node_shape.rect.width(width)
        node_shape.rect.height((node_shape.tags.children.length == 0 ? 64 : 32) * (node_shape.tags.children.length + 1))
        for (const edge_shape of Scene.edge_layer.children) {
            if (edge_shape.target_node == node_shape) {
                Edge.setTarget(edge_shape, node_shape)
            }
            if (edge_shape.source_node == node_shape) {
                Edge.refresh(edge_shape)
            }
        }
    },
    createNodeTagLabel: (node_shape, tag_name) => {
        const label = Util.createLabel(tag_name)
        label.draggable(true)
        label.on("dragstart", (e) => {
            Scene.drag_layer.add(label)
        })
        label.on("dragend", (e) => {
            const pos = Scene.stage.getPointerPosition()
            const inter_shape = Scene.node_layer.getIntersection(pos)
            console.log(inter_shape)
            if (inter_shape == null) {
                label.remove()
                Node.removeTag(node_shape, tag_name)
            } else {
                node_shape.tags.add(label)
                Node.refresh(node_shape)
            }
        })
        return label
    },
    addTag: (node_shape, tag_name) => {
        if (tag_name == "") {
            return
        }
        WorkData.attachNodeTag(node_shape.node_name, tag_name)
        const tag_list = node_shape.node_tags.split(" ")
        tag_list.push(tag_name)
        node_shape.node_tags = tag_list.join(" ")
        const label = Node.createNodeTagLabel(node_shape, tag_name)
        node_shape.tags.add(label)
        Node.refresh(node_shape)

        // if (WorkData.attachNodeTag(node_shape.node_name, tag_name)) {
        //     const tag_list = node_shape.node_tags.split(" ")
        //     if (!tag_list.includes(tag_name)) {
        //         tag_list.push(tag_name)
        //         node_shape.node_tags = tag_list.join(" ")
        //         const label = Node.createNodeTagLabel(node_shape, tag_name)
        //         node_shape.tags.add(label)
        //     }
        //     Node.refresh(node_shape)
        // } else {
        //     // 检查一下自己有没有这个标签
        //     let flag = false
        //     for (const label of node_shape.tags.children) {
        //         if (label.text.text() == tag_name) {
        //             flag = true
        //             break
        //         }
        //     }
        //     if (flag == false) {
        //         const tag_list = node_shape.node_tags.split(" ")
        //         tag_list.push(tag_name)
        //         node_shape.node_tags = tag_list.join(" ")
        //         const label = Node.createNodeTagLabel(node_shape, tag_name)
        //         node_shape.tags.add(label)
        //     }
        // }
    },
    removeTag: (node_shape, tag_name) => {
        console.log("正在删除节点标签: ", tag_name)
        for (const label of node_shape.tags.children) {
            if (label.text.text() == tag_name) {
                label.remove()
                break
            }
        }
        Node.refresh(node_shape)
    },
    renameTag: (node_shape, tag_name, new_name) => {
        for (const label of node_shape.tags.children) {
            if (label.text.text() == tag_name) {
                label.text.text(new_name)
                label.rect.width(label.text.width() + 2)
                break
            }
        }
        Node.refresh(node_shape)
    },
    getInterPosition: (node_shape, target_position) => {
        // 给定矩形外一点, 计算该点和矩形中点的连线与矩形的交点的坐标
        const rect_padding = 8
        const p3 = { x: 0, y: 0 }
        const p1 = node_shape.position()
        p1.x = p1.x - rect_padding
        p1.y = p1.y - rect_padding
        const width = node_shape.rect.width() + (2 * rect_padding)
        const height = node_shape.rect.height() + (2 * rect_padding)
        const half_width = width / 2
        const half_height = height / 2
        const p2 = target_position
        if (Util.belowLine(target_position, { x: p1.x, y: p1.y + height }, { x: p1.x + width, y: p1.y }) == Util.belowLine(target_position, p1, { x: p1.x + width, y: p1.y + height })) { // 如果在叉形图案的上下两个区域内
            p3.x = p1.x + half_width + (((half_height / (p2.y - (p1.y + half_height))) * (p2.x - (p1.x + half_width))) * (target_position.y > p1.y + half_height ? 1 : -1))
            p3.y = target_position.y > p1.y + half_height ? p1.y + height : p1.y
        } else { // 如果在叉形图案的左右两个区域内
            p3.x = target_position.x > p1.x + half_width ? p1.x + width : p1.x
            p3.y = p1.y + half_height + (((half_width / (p2.x - (p1.x + half_width))) * (p2.y - (p1.y + half_height))) * (target_position.x > p1.x + half_width ? 1 : -1))
        }
        return p3
    },
}
const Edge = {
    createEdge: (edge_id, edge_tag, source_node) => {
        const pointer = Util.clientToWorld(Scene.stage.getPointerPosition())
        const group = new Konva.Group()
        group.edge_id = edge_id
        group.source_node = source_node
        group.target_node = null
        group.target_arrow = Edge.createTargetArrow(group)
        group.edge_tag = Util.createLabel(edge_tag)
        group.edge_tag.position({ x: pointer.x || 0, y: pointer.y || 0 })
        group.edge_tag.hovering = null
        group.edge_tag.draggable(true)
        group.edge_tag.on("dragstart", (e) => {
            Scene.drag_layer.add(group.edge_tag)
        })
        group.edge_tag.on("dragmove", (e) => {
            const pos = Scene.stage.getPointerPosition()
            const inter_shape = Scene.edge_layer.getIntersection(pos)
            // console.log("拖拽：", inter_shape)
            if (inter_shape == null) {
                if (group.edge_tag.hovering != null) {
                    group.edge_tag.hovering.stroke("white")
                    group.edge_tag.hovering = null
                }
            } else if (inter_shape.path_point != null) { // 用是否有path_point属性来判断是非为segment
                if (group == inter_shape.edge_shape) {
                    if (group.edge_tag.hovering != null) {
                        group.edge_tag.hovering.stroke("#fff")
                    }
                    group.edge_tag.hovering = inter_shape
                    inter_shape.stroke("green")
                }
            }
        })
        group.edge_tag.on("dragend", (e) => {
            group.add(group.edge_tag)
            if (group.edge_tag.hovering != null && group.edge_tag.hovering.edge_shape == group) {
                Edge.attachTag(group, group.edge_tag.text.text(), group.edge_tag.hovering)
            } else {
                Edge.refresh(group)
            }
        })
        group.first_segment = Edge.createSegment(group.target_arrow, null, null, group)
        group.segment_count = 1
        group.attach_index = 0
        group.remove_button = Util.createRemoveButton({ x: 0, y: 0 })
        group.remove_button.on("click", (e) => {
            if (confirm("确认删除该边？")) {
                Scene.deleteEdge(group)
            }
        })
        group.on("mouseenter", (e) => {
            group.remove_button.visible(true)
            ToolSet.setTip("点击线条起始处圆形按钮删除该边\n拖拽箭头: 设置边的target为空或者一个节点\n点击线段处: 创建路径点\n可以拖拽路径点来编辑线条\n拖拽标签: 改变附着线段")
        })
        group.on("mouseleave", (e) => {
            group.remove_button.visible(false)
        })
        group.add(group.first_segment, group.target_arrow, group.edge_tag, group.remove_button)
        return group
    },
    createTargetArrow: (edge_shape) => {
        const pointer = Util.clientToWorld(Scene.stage.getPointerPosition())
        const polygon = new Konva.RegularPolygon({
            x: pointer.x || 0,
            y: pointer.y || 0,
            sides: 3,
            radius: 14,
            rotation: 0,
            fill: 'black',
            stroke: 'white',
            strokeWidth: 1,
            draggable: true,
        })
        polygon.hovering = null
        polygon.on("dragmove", (e) => {
            Edge.refresh(edge_shape)
            const pointer = polygon.absolutePosition()
            // const pointer = Util.clientToWorld(Scene.stage.getPointerPosition())
            const inter_shape = Scene.node_layer.getIntersection(pointer)
            if (inter_shape == null) {
                if (polygon.hovering != null) {
                    polygon.hovering.rect.stroke("#fff")
                    polygon.hovering = null
                }
            } else {
                let node_shape = inter_shape.parent
                while (node_shape.node_name == null) {
                    node_shape = node_shape.parent
                }
                polygon.hovering = node_shape
                node_shape.rect.stroke(node_shape.rect.fill())
            }
        })
        polygon.on("dragend", (e) => {
            edge_shape.source_node.setDraggable(true)
            Edge.setTarget(edge_shape, polygon.hovering)
        })
        polygon.on("mouseenter", (e) => {
            polygon.stroke("#000")
        })
        polygon.on("mouseleave", (e) => {
            polygon.stroke("#fff")
        })
        return polygon
    },
    createPathPoint: (position) => {
        const circle = new Konva.Circle({
            x: position.x || 0,
            y: position.y || 0,
            radius: 8,
            fill: "#ccc",
            draggable: true,
        })
        circle.on("mouseenter", (e) => {
            circle.fill("#ff0")
        })
        circle.on("mouseleave", (e) => {
            circle.fill("#ccc")
        })
        return circle
    },
    createSegment: (path_point, prefix, suffix, edge_shape) => {
        const pointer = Util.clientToWorld(Scene.stage.getPointerPosition())
        const segment = new Konva.Line({
            points: [pointer.x || 0, pointer.y || 0, path_point.x(), path_point.y()],
            stroke: "#FFF",
            strokeWidth: 6,
            hitStrokeWidth: 16,
            lineCap: "round",
            lineJoin: "round",
            // zIndex: 0,
        })
        segment.prefix = prefix
        segment.suffix = suffix
        segment.path_point = path_point
        segment.edge_shape = edge_shape
        segment.on("mouseenter", (e) => {
            segment.stroke("#484")
        })
        segment.on("mouseleave", (e) => {
            segment.stroke("#fff")
        })
        segment.on("mousedown", (e) => {
            Edge.addPathpoint(edge_shape, segment)
        })
        return segment
    },
    refresh: (edge_shape) => {
        // 从 edge_shape.first_segment 开始逐个segment对齐到pathpoint上
        let current_segment = edge_shape.first_segment
        let current_pathpoint = current_segment.path_point.position()
        // let prefix_segment = null
        let prefix_pathpoint = null
        const inter_position = Node.getInterPosition(edge_shape.source_node, current_pathpoint)
        current_segment.points([inter_position.x, inter_position.y, current_pathpoint.x, current_pathpoint.y])
        while (current_segment.suffix != null) {
            prefix_segment = current_segment
            prefix_pathpoint = current_pathpoint
            current_segment = current_segment.suffix
            current_pathpoint = current_segment.path_point.position()
            current_segment.points([prefix_pathpoint.x, prefix_pathpoint.y, current_pathpoint.x, current_pathpoint.y])
        }
        // 更新label的位置
        // const source_position = edge_shape.source_node.position()
        let attached_segment = edge_shape.first_segment
        for (let i = 0; i < edge_shape.attach_index; i++) {
            attached_segment = attached_segment.suffix
        }
        const segment_points = attached_segment.points()
        const x = ((segment_points[2] + segment_points[0]) / 2) - (edge_shape.edge_tag.rect.width() / 2)
        const y = (segment_points[3] + segment_points[1]) / 2 - (edge_shape.edge_tag.rect.height() / 2)
        edge_shape.edge_tag.position({ x: x, y: y })
        // 更新 remove_button 的位置
        edge_shape.remove_button.position(inter_position)
        // 更新 target_arrow 的 rotation
        while (attached_segment.suffix != null) {
            attached_segment = attached_segment.suffix
        }
        const points = attached_segment.points()
        const dx = points[2] - points[0];
        const dy = points[3] - points[1];
        if (dx > 0) {
            edge_shape.target_arrow.rotation((Math.atan(dy / dx) * 180 / Math.PI) + 90)
        } else if (dx < 0) {
            edge_shape.target_arrow.rotation((Math.atan(dy / dx) * 180 / Math.PI) - 90)
        }
        // 更新WorkData
        current_segment = edge_shape.first_segment
        for (let i = 0; i < edge_shape.segment_count; i++) {
            WorkData.edge_list[edge_shape.edge_id].pathpoint_list[i] = current_segment.path_point.position()
            current_segment = current_segment.suffix
        }
    },
    addPathpoint: (edge_shape, target_segment) => {
        const path_point = Edge.createPathPoint(Util.clientToWorld(Scene.stage.getPointerPosition()))
        const segment = Edge.createSegment(path_point, target_segment.prefix, target_segment, edge_shape)
        if (target_segment.prefix != null) {
            target_segment.prefix.suffix = segment
        }
        target_segment.prefix = segment
        if (target_segment == edge_shape.first_segment) {
            edge_shape.first_segment = segment
        }
        edge_shape.segment_count = edge_shape.segment_count + 1
        edge_shape.add(segment, path_point)
        segment.zIndex(0)
        let i = 0
        let seg = edge_shape.first_segment
        while (seg != segment) {
            seg = seg.suffix
            i += 1
        }
        if (i < edge_shape.attach_index) {
            edge_shape.attach_index += 1
        }
        WorkData.edge_list[edge_shape.edge_id].pathpoint_list.splice(0, 0, path_point.position())
        path_point.on("dragmove", (e) => {
            Edge.setTarget(edge_shape, edge_shape.target_node)
            Edge.refresh(edge_shape)
        })
        path_point.on("dblclick", (e) => {
            if (edge_shape.source_node == edge_shape.target_node && edge_shape.segment_count == 2) {
                alert("不能删除自指边的最后一个路径点。")
            } else {
                Edge.deletePathpoint(edge_shape, path_point)
            }
        })
        path_point.startDrag()
        return path_point
    },
    deletePathpoint: (edge_shape, path_point) => {
        // 首先找到segment
        let segment = edge_shape.first_segment
        let seg_index = 0
        while (segment.path_point != path_point) {
            segment = segment.suffix
            seg_index += 1
        }
        // 然后将segment 和 pathpoint 都删了
        segment.remove()
        path_point.remove()
        edge_shape.segment_count -= 1
        if (segment == edge_shape.first_segment) { // 如果是first_segment就更新first_segment
            edge_shape.first_segment = segment.suffix
            segment.suffix.prefix = null
        } else { // 然后设置前驱的suffix和后继的prefix
            segment.prefix.suffix = segment.suffix
            segment.suffix.prefix = segment.prefix
        }
        if (edge_shape.attach_index > seg_index) {
            edge_shape.attach_index -= 1
        }
        WorkData.edge_list[edge_shape.edge_id].pathpoint_list.pop() // 然后在WorkData中去掉一个pathpoint
        Edge.refresh(edge_shape) // 然后refresh
        edge_shape.remove_button.visible(false)
    },
    attachTag: (edge_shape, tag_name, attached_segment) => {
        if (WorkData.updateEdgeTag(edge_shape.edge_id, tag_name)) {
            edge_shape.edge_tag.text.text(tag_name)
            edge_shape.edge_tag.rect.width(edge_shape.edge_tag.text.width())
            let i = 0
            let segment = edge_shape.first_segment
            while (segment != attached_segment) {
                segment = segment.suffix
                i += 1
            }
            WorkData.edge_list[edge_shape.edge_id].attach_index = i
            edge_shape.attach_index = i
            attached_segment.stroke("white")
            if (edge_shape.edge_tag.hovering != null) {
                edge_shape.edge_tag.hovering = null
            }
            Edge.refresh(edge_shape)
            return true
        } else {
            return false
        }
    },
    setTarget: (edge_shape, target_node) => {
        if (WorkData.setEdgeTarget(edge_shape.edge_id, target_node == null ? null : target_node.node_name)) {
            edge_shape.target_node = target_node
            if (edge_shape.target_node == edge_shape.source_node && edge_shape.segment_count == 1) {
                const position = target_node.position()
                position.y = position.y + 128
                Edge.addPathpoint(edge_shape, edge_shape.first_segment)
                edge_shape.first_segment.path_point.stopDrag()
                edge_shape.first_segment.path_point.position(position)
                Edge.refresh(edge_shape)
            }
            // 更新target_arrow的position
            if (edge_shape.target_node != null) { // 把target_arrow的位置放在目标节点边上，然后refresh
                if (edge_shape.segment_count == 1) {
                    const target_inter_pos = Node.getInterPosition(edge_shape.target_node, edge_shape.remove_button.position())
                    edge_shape.target_arrow.position(target_inter_pos)
                } else {
                    let last_segment = edge_shape.first_segment
                    while (last_segment.suffix != null) {
                        last_segment = last_segment.suffix
                    }
                    const target_inter_pos = Node.getInterPosition(edge_shape.target_node, last_segment.prefix.path_point.position())
                    edge_shape.target_arrow.position(target_inter_pos)
                }
                Edge.refresh(edge_shape)
            }
        }
    },
}
const Scene = {
    stage: new Konva.Stage({
        container: "main_area",
        width: MainArea.clientWidth,
        height: MainArea.clientHeight,
        draggable: true,
    }),
    back_layer: new Konva.Layer(),
    node_layer: new Konva.Layer(),
    edge_layer: new Konva.Layer(),
    drag_layer: new Konva.Layer(),
    addNode: (node_name, position) => {
        const node_tags = NodeTagSet.getSelectedNodeTags()
        const name = WorkData.addNode(node_name, node_tags, position)
        const node_shape = Node.create(name, position)
        Scene.node_layer.add(node_shape)
        for (const tag_name of node_tags.split(" ")) {
            Node.addTag(node_shape, tag_name)
        }
        Node.refresh(node_shape)
        return node_shape
    },
    deleteNode: (node_name) => {
        const result = WorkData.deleteNode(node_name)
        if (result == true) {
            for (const group of Scene.node_layer.children) {
                if (group.node_name == node_name) {
                    group.remove()
                    break
                }
            }
            const out_edge_id_list = []
            for (const edge_shape of Scene.edge_layer.children) {
                if (edge_shape.source_node.node_name == node_name) {
                    out_edge_id_list.push(edge_shape)
                }
            }
            while (out_edge_id_list.length > 0) {
                Scene.deleteEdge(out_edge_id_list.pop())
            }
        }
    },
    dropNodeTag: (position, tag_name) => {
        // console.log(position, tag_name)
        // const pos = Util.clientToWorld(position)
        const inter_shape = Scene.node_layer.getIntersection(position)
        if (inter_shape != null) {
            let node_shape = inter_shape.parent
            while (node_shape.node_name == null) {
                node_shape = node_shape.parent
            }
            if (!node_shape.node_tags.split(" ").includes(tag_name)) {
                Node.addTag(node_shape, tag_name)
            }
        }
    },
    addEdge: (source, edge_tag) => {
        source.setDraggable(false)
        const edge_id = WorkData.addEdge(source.node_name, null, edge_tag)
        const edge_shape = Edge.createEdge(edge_id, edge_tag, source)
        Scene.edge_layer.add(edge_shape)
        edge_shape.target_arrow.startDrag()
        return edge_shape
    },
    deleteEdge: (edge_shape) => {
        const result = WorkData.deleteEdge(edge_shape.edge_id)
        if (result == true) {
            edge_shape.remove()
            const removed_id = edge_shape.edge_id
            for (let i = 0; i < Scene.edge_layer.children.length; i++) {
                const edge_shape = Scene.edge_layer.children[i];
                if (edge_shape.edge_id > removed_id) {
                    edge_shape.edge_id -= 1
                }
            }
        }
    },
}
InitScene: {
    Scene.back_layer.add(new Konva.Line({
        x: 1, y: 1,
        points: [0, 0, MainArea.clientWidth - 3, 0, MainArea.clientWidth - 3, MainArea.clientHeight - 3, 0, MainArea.clientHeight - 3, 0, 0],
        stroke: '#666',
    }))
    Scene.stage.add(Scene.back_layer, Scene.node_layer, Scene.edge_layer, Scene.drag_layer)
    Scene.stage.on("dblclick", (e) => {
        if (e.target != Scene.stage) {
            return
        }
        const offset = Scene.stage.absolutePosition()
        const scale = Scene.stage.scale()
        const x = (e.evt.x - offset.x) / scale.x
        const y = (e.evt.y - offset.y) / scale.y
        let node_name = MainArea.promptName("请输入节点名: ", "新节点")
        if (node_name != null) {
            Scene.addNode(node_name, { x: x, y: y })
        }
    })
    Scene.stage.on("wheel", (e) => {
        Util.zoom(e.evt.deltaY)
    })
    Scene.stage.on("mouseover", (e) => {
        if (e.target == Scene.stage) {
            ToolSet.setTip("双击空白处: 新建状态节点\n鼠标滚轮: 缩放画布\n左键空白处拖拽画布")
        }
    })
    window.onresize = () => {
        Scene.stage.setWidth(MainArea.clientWidth)
        Scene.stage.setHeight(MainArea.clientHeight)
    }
}
// 初始化完毕后自动在新项目中创建默认标签和默认谓词
InitNewProject: {
    NodeTagSet.addNodeTag("默认标签")
    EdgeTagSet.addEdgeTag("默认信号")
}
