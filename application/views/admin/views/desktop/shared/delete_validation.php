<div id="validation-popup" class="modal hide fade" style="opacity: 1">
	<div class="modal-header">
		<div class="modal-inner">
			<div class="row-fluid">
				<div class="span6">
					<h3>Supprimer l'element #{{deleteId}}?</h3>
				</div>
				<div class="span6">
					<div class="pull-right">
						<a href="javascript:hideModal();" ><i class="fa fa-remove circle-icon"></i></a>
						<a href="javascript:hideModal();" ng-click="deleteItem(deleteId, $index)"><i class="fa fa-ok circle-icon"></i></a>
					</div>
				</div>
			</div>
		</div>	
	</div>
</div>