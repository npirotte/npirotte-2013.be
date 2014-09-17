<!-- Nested node template -->
<script type="text/ng-template" id="nodes_renderer.html">
  <div ui-tree-handle class="tree-node tree-node-content" ng-class="smallSize">
    <a class="btn btn-default btn-xs angular-ui-tree-btn" ng-if="node.nodes && node.nodes.length > 0" data-nodrag ng-click="toggle(this)"><i class="fa" ng-class="{'fa-angle-right': collapsed, 'fa-angle-down': !collapsed}"></i></a>
    <span class="pusher" ng-if="!node.nodes || node.nodes.length === 0"></span>
    <a ng-click="getPage(node.id)" class="node-name" ng-class="currentId === node.id ? 'active' : ''">{{node.name}}</a>
    <a class="pull-right" data-nodrag ng-click="remove(this)"><i class="fa fa-times"></i></a>
    <a class="pull-right" data-nodrag ng-click="newSubItem(node.id)" style="margin-right: 8px;"><i class="fa fa-plus"></i></a>
  </div>
  <ol ui-tree-nodes="" ng-model="node.nodes" ng-class="{hidden: collapsed}">
    <li ng-repeat="node in node.nodes" ui-tree-node ng-include="'nodes_renderer.html'">
    </li>
  </ol>
</script>

<div>
  <select name="tree_culture" ng-model="treeCulture">
    <option ng-repeat="lang in languages" ng-selected="lang.KeyName == treeCulture" value="{{lang.KeyName}}">{{lang.LangName}}</option>
  </select>
</div>
<div ui-tree="treeOptions" id="tree-root" data-drag-delay="500">
  <ol ui-tree-nodes="" ng-model="data">
    <li ng-repeat="node in data" ui-tree-node ng-include="'nodes_renderer.html'"></li>
  </ol>
</div>