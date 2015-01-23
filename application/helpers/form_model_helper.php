<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/** 
 * affiche un element de formulaire
 *
 * @access	public
 * @param	$self
 * @param	int
 * @return	string
 */

if ( ! function_exists('print_input'))
{
	function print_model_input($self, $tag, $model, $element, $nameSpace, $form) {
		//controler
		try {
			$model_element = $self->db_model->database_model($model);	

			try {
				$model_element = $model_element['fields'][$element];

				$data = array(
		            'name'        => $element,
		            'id'          => $nameSpace . '_' . $element,
		            //'ng-model'       => $nameSpace.'.'.$element
		        );

		        if (isset($model_element['constraint'])) {
		        	$data['ng-maxlength']  = $model_element['constraint'];
		        }

		        if (isset($model_element['required'])) {
		        	$data['data-required'] = 'true';
		        }

		        if (isset($model_element['validation'])) {
		        	$data['validation'] = $model_element['validation'];
		        }

		        if ( isset($_POST[$element])) {
		        	$data['value'] = $_POST[$element];
		        }

		        switch ($tag)
		        {
		        	case 'text':
		        		echo form_input($data);
		        		break;
		        	case 'textarea':
		        		$data['rows'] = 3;
		        		echo form_textarea($data);
		        		break;
		        	case 'wysiwyg':
		        		$data['ui-tinymce'] = 'tinymceOptions';
		        		echo form_textarea($data);
		        		break;
		        	case 'htmleditor':
		        		$data['style'] = 'height: 0pc; opacity: 0';
		        		echo form_textarea($data);
		        		echo '<div ui-ace="aceConfig" ng-model="'.$data['ng-model'].'" style="height: 400px"></div>';
		        		break;
		        	case 'datepicker':
		        		$data['datepicker'] = true;
		        		$data['datepicker-popup'] = "dd-MM-yyyy";
		        		$data['is-open'] = "opened";
		        		echo form_input($data);
		        		break;
		        	case 'select':
		        		//$data['ui-select2'] = true;
		        		$option = 'ui-select2 ng-model="'.$nameSpace.'.'.$element.'"';
		        		echo form_dropdown($element, $model_element['options'], 'false', $option);
		        		break;
		        }

		        /*if (isset($model_element['required'])) {
		        	echo '<div class="label label-danger" ng-show="'.$form.'.'.$element.'.$error.required && '.$form.'.'.$element.'.$dirty">Ce champ est requis</div>'; 
		        }

		        if (isset($data['validation'])) {
		        	echo '<div class="label label-danger" ng-show="'.$form.'.'.$element.'.$error.validation">{{'.$data['id'].'}}</div>';
		        }

		        if (isset($model_element['constraint'])) {
		        	echo '<div class="label label-danger" ng-show="'.$form.'.'.$element.'.$error.maxlength">Max. '.$model_element['constraint'].' caractères.</div>'; 
		        } */
	
			} catch (Exception $e) {
				echo $e;
			}
		} catch (Exception $e) {
			echo $e;
		}
	}
}

?>
