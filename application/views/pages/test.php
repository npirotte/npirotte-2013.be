<div class="container">
	{{title}} <br />
	{{meta_description}}
	@helper{print_form(5)}
	@helper{print_contact_info_list(0)}
	@helper{banner_zone(homePageBanner)}

	@if{1 == 1 && 1 == 1 ( coucou )}

	@template{subcontent()}

	@template{header(textBox, required, 80)}

	@function{date(now)}
</div>
