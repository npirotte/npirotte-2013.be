<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Condition
{
	private $condition;
	private $delimiter;
	private $pattern = '/^([^=!<>]*)(==|!=|<|>|<=|>=){0,1}([\s\S]*)$/';
	private $matches;
	public $result;

	public function __construct($condition, $delimiter)
	{
		$this->condition = $condition;
		$this->delimiter = $delimiter;

		$this->result = $this->apply_condition();

	}

	public function Stop()
	{
		$isRunning = TRUE;

		if ($this->delimiter === '' || $this->delimiter === undefined) {
			$isRunning = FALSE;
		}

		else if ($this->result === TRUE && $this->delimiter == '||')
		{
			$isRunning = FALSE;
		}

		else if($this->result == FALSE && $this->delimiter == '&&')
		{
			$isRunning = FALSE;
		}

		return $isRunning;
	}

	private function apply_condition()
	{
		$condition = preg_match($this->pattern, $this->condition, $condition_array);
		$return = TRUE;
		$prop_1 = trim($condition_array[1]);
		$prop_2 = trim($condition_array[3]);

		switch (trim($condition_array[2])) {
			case '==':
				$return = $prop_1 === $prop_2 ? TRUE : FALSE;
				break;
			case '!=':
				$return = $prop_1 != $prop_2 ? TRUE : FALSE;
				break;
			case '>':
				$return = (int)$prop_1 > (int)$prop_2 ? TRUE : FALSE;
				break;
			case '<':
				$return = (int)$prop_1 < (int)$prop_2 ? TRUE : FALSE;
				break;
			case '>=':
				$return = (int)$prop_1 >= (int)$prop_2 ? TRUE : FALSE;
				break;
			case '<=':
				$return = (int)$prop_1 <= (int)$prop_2 ? TRUE : FALSE;
				break;
		}

		return $return;
	}
}

class MY_Parser extends CI_Parser
{
	var $function_delimiter_l = '@{';
	var $function_delimiter_r = '}';

	protected $CI;
	private $function_match_tree;

	public function __construct()
	{
        //parent::__construct(); // Pas de constructeur
        $this->CI =& get_instance();
	}

	public function parse_template($template, $field_values)
	{
		$pattern= '/(@)(template)(\{)([^\(\}]*)([\(]{0,1})([^\)\}]*)(gridEditor){1}([^\)\}]*)([\)]{0,1})(\})/';

		foreach ($field_values as $field_value) {

			if (preg_match($pattern, $field_value['field_name'])) {
				$field_value['value'] = $this->make_grid($field_value['value']);
			}

			$template = str_replace($field_value['field_name'], $field_value['value'], $template);
		}

		return $template;
	}

	private function make_grid($data)
	{
		$return = '';
		foreach ($data as $item) {
			$return .= $this->CI->load->view('shared/grid_generator', $item, true);
		}

		return $return;
	}

	public function record_templatefields($string)
	{
		$pattern= '/(@)(template)(\{)([^\(\}]*)([\(]{0,1})([^\)\}]*)([\)]{0,1})(\})/';

		preg_match_all($pattern, $string, $this->function_match_tree);

		return $this->get_templatefields_data();
	}

	private function get_templatefields_data()
	{
		$i = 0;
		$weight = 0;
		$result = array();
		foreach ($this->function_match_tree[0] as $templatefield) 
		{
			$field_name = $this->function_match_tree[4][$i];

			if (!isset($result[$field_name])) {
				# code...
			
				$result[$field_name]['full_name'] = $templatefield;
				$result[$field_name]['name'] = $field_name;

				$params  = $this->function_match_tree[6][$i];

				$params = explode(',', $params);

				$j = 0;

				foreach ($params as $param) {

					$param = trim($param);

					if ($param === 'required') 
					{
						$result[$field_name]['is_required'] = 1;
					}
					else if (preg_match('/^[\d]+/', $param)) {
						$result[$field_name]['max_length'] = intval($param);
					}
					else if ($j === 0)
					{
						$result[$field_name]['type'] = $param;
					}

					$j++;
				}

				if (!isset($result[$field_name]['type']) || $result[$field_name]['type'] == '') {
					$result[$field_name]['type'] = 'textEditor';
				}
				if (!isset($result[$field_name]['is_required'])) {
					$result[$field_name]['is_required'] = 0;
				}
				if (!isset($result[$field_name]['max_length'])) {
					$result[$field_name]['max_length'] = 10000;
				}

				$result[$field_name]['weight'] = $weight++;

			}

			$i++;
			
		}

		return $result;
	}

	public function parse_functions($string)
	{	
		$pattern = '/(@)([^{\s]*)({)([^\(]*)(\()([^\)]*)(\))(})/';

		preg_match_all($pattern, $string, $this->function_match_tree);

		$string = $this->apply_functions($string);

		//print_r($this->function_match_tree);

		return $string;
	}

	private function apply_functions($string)
	{

		$i = 0;

		foreach ($this->function_match_tree[0] as $function) 
		{
			switch($this->function_match_tree[2][$i])
			{
				case 'helper' :
					$string = $this->helpers_visitor($string, $i);
					break;
				case 'if' :
					$string = $this->conditions_visitor($string, $i);
					break;
			}

			$i++;
		}

		return $string;
	}

	private function helpers_visitor($string, $i)
	{
		$result = FALSE;
		$params = $this->function_match_tree[6][$i];

		switch ($this->function_match_tree[4][$i])
		{
			case 'print_form' :
				$this->CI->load->helper('/contact/contact');
				$result = print_form($params);
				break;
			case 'print_contact_info_list' : 
				$this->CI->load->helper('/contact/contact');
				$result = print_contact_info_list($params);
				break;
			case 'banner_zone' :
				$this->CI->load->helper('/banners/banners');
				$result = banner_zone($params);
				break;
			case 'portfolio_categories_list' :
				$this->CI->load->helper('/portfolio/portfolio');
				$result = portfolio_categories_list();
				break;
			case 'portfolio_thumb_list':
				$this->CI->load->helper('/portfolio/portfolio');
				$result = portfolio_thumb_list($params);
				break;
			case 'last_news_item' :
				$this->CI->load->helper('/news/news');
				$result = last_news_item($params);
				break;
			case 'news_list' :
				$this->CI->load->helper('/news/news');
				$params = explode(',', $params);
				$result = news_list($params[0], intval($params[1]));
				break;
			case 'menu' :
				$this->CI->load->helper('/pages/menus');
				$result = print_menu($params);
				break;
			case 'sub_menu' :
				$this->CI->load->helper('/pages/menus');
				$params = explode(',', $params);
				$result = print_menu($params[0], intval($params[1]));
				break;
		}

		if ($result) 
		{
			$string = str_replace($this->function_match_tree[0][$i], $result, $string);
		}

		return $string;
	}

	private function conditions_visitor($string, $i)
	{
		$result = FALSE;
		$conditioned = $this->function_match_tree[6][$i];
		$condition = $this->function_match_tree[4][$i];
		$conditions_results = array();

		$splitter_patter = '/([^&&||]*)([&|]{0,2})/';
		$condition_pattern = '/^([^=!<>]*)(==|!=|<|>|<=|>=){0,1}([\s\S]*)$/';

		preg_match_all($splitter_patter, $condition, $conditions);

		$j = 0;
		$running = TRUE;
		$result = FALSE;

		while($running)
		{
			$this_condition = new Condition($conditions[1][$j], $conditions[2][$j++]);
			$result = $this_condition->result;
			$running = $this_condition->Stop();
		}

		if ($result) {
			$str_replace = $result ? trim($this->function_match_tree[6][$i]) : '';
		}

		$string = str_replace($this->function_match_tree[0][$i], $str_replace, $string);

		return $string;
	}

}

/* End of file MY_Parser.php */
/* Location: ./application/libraries/MY_Parser.php */
