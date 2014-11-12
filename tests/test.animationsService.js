describe("A suite", function() {

  var 	options = {
  			Delay : 400,
  			InClass : 'in',
  			OutClass : 'out'
  		},
  		animationService = new AnimationsService();

  beforeEach(function() {
    timerCallback = jasmine.createSpy("timerCallback");
    jasmine.clock().install();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
  });
  
  it("ComeIn animation", function() {
  	animationService.ComeIn();
    expect($('body').hasClass('in')).toBe(true);
  });

  it("ComeOut animation", function() {
  	animationService.GoOut();

    expect($('body').hasClass('out')).toBe(true);

    jasmine.clock().tick(399);

    expect($('body').hasClass('out')).toBe(true);

    jasmine.clock().tick(400);

    expect($('body').hasClass('out')).toBe(false);
  });

  it("ComeOut callback", function(){

  	var resolved = false;

	  animationService
	  	.GoOut()
	  	.then(function()
	  	{
	  		resolved = true;
	  	})

  	  jasmine.clock().tick(399);
  	  expect(resolved).toBe(false);

  	  jasmine.clock().tick(400);
  	  expect(resolved).toBe(true);

  });

});