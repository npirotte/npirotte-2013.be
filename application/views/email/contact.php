<html>
	<body>
		<h1>Contact de <?=$sitename;?></h1>
		<table>
			<?php foreach($fields as $field): ?>
				<tr>
					<td><strong><?=$field['field_name'];?></strong></td>
					<td><?=$field['field_value'];?></td>
				</tr>
			<?php endforeach; ?>
		</table>
	</body>
</html>