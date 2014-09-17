<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class List_query_filters
{
  protected 	$ci;
  private $config;

	public function __construct($config)
	{
        $this->ci =& get_instance();
        $this->config = $config;
	}

	public function set_config($config)
	{
		$this->config = $config;
	}

	public function setFilters()
    {

		if ($this->ci->input->get('orderprop')) {
			//gestion des exeptions
			if($this->ci->input->get('orderprop') != 'childs_count')
			{
				$this->reorder($this->config['table'].'.'.$this->ci->input->get('orderprop'), $this->ci->input->get('reverse'));
			}
		}

		if ($this->ci->input->get('search')) {
			$cols = array('name', 'slug', 'id');
			$this->filter($this->ci->input->get('search'));
		}
    }

    private function reorder($prop, $sens)
	{
		if (isset($this->config['transform'][$prop])) 
		{
			$prop = $this->config['transform'][$prop];
		}
		$this->ci->db->order_by($prop, $sens == 'true' ? 'asc' : 'desc');
	}

	private function filter($query)
	{
		$i = 0;

		foreach ($this->config['filtered_cols'] as $key => $value) {
			if ($i++ === 0) {
				$this->ci->db->like($value, $query);
			}
			else
			{
				$this->ci->db->or_like($value, $query);
			}
			
		}
		
	}
}

/* End of file ListQueryFilters.php */
/* Location: ./application/libraries/ListQueryFilters.php */