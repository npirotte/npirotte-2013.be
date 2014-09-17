<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Models_service
{
  protected 	$ci;
  private $site_languages;

	public function __construct()
	{
        $this->ci =& get_instance();
        $this->site_languages = $this->ci->lang->languages;
	}

	public function Localize($model)
    {

    	$newModel = array(
    		'keys' => $model['keys']
    		);

    	foreach ($model['fields'] as $col => $col_params) 
    	{
    		if (array_key_exists('localize', $col_params)) 
    		{
    			foreach ($this->site_languages as $lang) {
    				$newModel['fields'][$col.'_'.$lang] = $this->RegenerateCol($col_params, $lang);
    			}
    		}
    		else
    		{
    			$newModel['fields'][$col] = $col_params;
    		}
    	}

    	return $newModel;
    }

    private function RegenerateCol($col_params, $lang)
    {
    	$newParams = array();
    	$i = 0;

    	foreach($col_params as $key => $param)
    	{
    		if ($key != 'localize') {
    			$newParams[$key] = $param;
    		}
    	}	

    	return $newParams;
    }

    public function LocalizeString($string)
    {
        $result = array();
        foreach ($this->site_languages as $lang) {
            $result[] = $string.'_'.$lang;
        }

        return $result;
    }
}

/* End of file Models_service.php */
/* Location: ./application/libraries/Models_service.php */