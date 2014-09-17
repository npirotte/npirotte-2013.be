<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class MY_Form_validation extends CI_Form_validation 
{
	public function __construct()
	{
		parent::__construct();
	}

	public function item_available($str, $params)
	{
		$params = explode(',', $params);

		$item_id = trim($params[0]);
		$id_col = trim($params[1]);
		$table = trim($params[2]);
		$col = trim($params[3]);

		if ($item_id != 0)
		{

			$this->CI->db->where('id != ',$item_id);
		}

		$this->CI->db->Where($col, $str);

		$count = $this->CI->db->count_all_results($table);
		
		$result = $count === 0;

		if (!$result) {
			$this->CI->form_validation->set_message('item_available', 'La valeur "'.$str.'" du champ %s existé déjà dans la base de donnée' );
		}

		return $result;
	}

	public function item_available_localized($str, $params)
	{

		$paramsArray = explode(',', $params);
		$lang = trim($paramsArray[4]);

		$this->CI->db->where('lang', $lang);

		return $this->item_available($str, $params);
	}

	// flexi auth functions

    // Check identity is available
    protected function identity_available($identity, $user_id = FALSE)
    {
		if (!$this->CI->flexi_auth->identity_available($identity, $user_id))
		{
			$status_message = $this->CI->lang->line('form_validation_duplicate_identity');
			$this->CI->form_validation->set_message('identity_available', $status_message);
			return FALSE;
		}
        return TRUE;
    }
  
    // Check email is available
    protected function email_available($email, $user_id = FALSE)
    {
		if (!$this->CI->flexi_auth->email_available($email, $user_id))
		{
			$status_message = $this->CI->lang->line('form_validation_duplicate_email');
			$this->CI->form_validation->set_message('email_available', $status_message);
			return FALSE;
		}
        return TRUE;
    }
  
    // Check username is available
    protected function username_available($username, $user_id = FALSE)
    {
		if (!$this->CI->flexi_auth->username_available($username, $user_id))
		{
			$status_message = $this->CI->lang->line('form_validation_duplicate_username');
			$this->CI->form_validation->set_message('username_available', $status_message);
			return FALSE;
		}
        return TRUE;
    }
  
    // Validate a password matches a specific users current password.
    protected function validate_current_password($current_password, $identity)
    {
		if (!$this->CI->flexi_auth->validate_current_password($current_password, $identity))
		{
			$status_message = $this->CI->lang->line('form_validation_current_password');
			$this->CI->form_validation->set_message('validate_current_password', $status_message);
			return FALSE;
		}
        return TRUE;
    }
	
    // Validate Password
     protected function validate_password($password)
    {
		$password_length = strlen($password);
		$min_length = $this->CI->flexi_auth->min_password_length();

		// Check password length is valid and that the password only contains valid characters.
		if ($password_length >= $min_length && $this->CI->flexi_auth->valid_password_chars($password))
		{
			return TRUE;
		}
		
		$status_message = $this->CI->lang->line('password_invalid');
		$this->CI->form_validation->set_message('validate_password', $status_message);
		return FALSE;
    }
 
    // Validate reCAPTCHA
    protected function validate_recaptcha()
    {
		if (!$this->CI->flexi_auth->validate_recaptcha())
		{
			$status_message = $this->CI->lang->line('captcha_answer_invalid');
			$this->CI->form_validation->set_message('validate_recaptcha', $status_message);
			return FALSE;
		}
        return TRUE;
    }
 
    // Validate Math Captcha
    protected function validate_math_captcha($input)
    {
		if (!$this->CI->flexi_auth->validate_math_captcha($input))
		{
			$status_message = $this->CI->lang->line('captcha_answer_invalid');
			$this->CI->form_validation->set_message('validate_math_captcha', $status_message);
			return FALSE;
		}
        return TRUE;
    }


    // -------------------------------------------------------------------
	/**
	* Error Array
	*/

	public function error_array()
	{
		$errors = $this->_error_array;
		return $errors;
	}
}

/* End of file MY_Form_validation.php */
/* Location: ./application/library/MY_Form_validation.php */ 	