<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="WellCommerce.org">
    

    <title>Home Page || WellCommerce.org</title>

	<link rel="shortcut icon" href="assets/img/favicon.ico" type="image/x-icon">
	<link rel="icon" href="assets/img/favicon.ico" type="image/x-icon">
    <link href="assets/css/bootstrap.css" rel="stylesheet">
    <!-- <link href="assets/css/bootstrap-theme.css" rel="stylesheet"> -->
    <link href="assets/css/wellcommerce.less" rel="stylesheet/less">

    <script src="assets/js/jquery-2.1.1.min.js"></script>
    <script src="assets/js/bootstrap.js"></script>
    <script src="assets/js/less.js"></script>

</head>

<body>
	<header>
		<div class="container">
			<div class="row">
				<div class="col-lg-6 col-md-6 col-sm-12"><a href="#" class="logo"><b>Well</b>Commerce</a></div>
				
				<div class="col-lg-6 col-md-6 hidden-sm hidden-xs text-right">	
					<div class="btn-group btn-group-sm">
						<div class="btn-group btn-group-sm">
							<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
								Language: EN
								<span class="caret"></span>
							</button>
							
							<ul class="dropdown-menu" role="menu">
								<li><a href="#">EN</a></li>
								<li><a href="#">PL</a></li>
								<li><a href="#">FR</a></li>
								<li><a href="#">DE</a></li>
							</ul>
						</div>
					
						<div class="btn-group btn-group-sm">
							<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
								Currency: USD
								<span class="caret"></span>
							</button>
							
							<ul class="dropdown-menu" role="menu">
								<li><a href="#">EUR</a></li>
								<li><a href="#">PLN</a></li>
							</ul>
						</div>
					</div>
				
					<div class="btn-group btn-group-sm">
						<a href="#" class="btn btn-primary">Sign in</a>
						<a href="#" class="btn btn-default">Sign up</a>
						<a href="#" class="btn btn-default">Cart ($2900,99)</a>
					</div>	
				</div>
			</div>
			<nav class="navbar navbar-inverse" role="navigation">
				<div class="navbar-header">
					<a href="cart.php" class="navbar-brand hidden-lg hidden-md hidden-sm">Cart: 3 items ($2900,99)</a>
				
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
				</div>
				
		
				<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<ul class="nav navbar-nav">
						<li class="dropdown active">
						  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Categories <span class="caret"></span></a>
						  <ul class="dropdown-menu" role="menu">
						    <li><a href="#">Category One</a></li>
						    <li><a href="#">Category Two</a></li>
						    <li><a href="#">Category Three</a></li>
						    <li><a href="#">Category Four</a></li>
						    <li><a href="#">Category Five</a></li>
						  </ul>
						</li>
						
						<li class="dropdown">
						  <a href="#" class="dropdown-toggle" data-toggle="dropdown">CMS <span class="caret"></span></a>
						  <ul class="dropdown-menu" role="menu">
						    <li><a href="#">Static One</a></li>
						    <li><a href="#">Static Two</a></li>
						    <li><a href="#">Static Three</a></li>
						    <li><a href="#">Static Four</a></li>
						    <li><a href="#">Static Five</a></li>
						  </ul>
						</li>

						<li><a href="#">About</a></li>
						<li><a href="#">Help</a></li>
						<li><a href="#">Contact</a></li>
					</ul>
					
					<form class="navbar-form navbar-right" role="search">
						<div class="input-group">
							<input type="text" class="form-control" placeholder="Search items">
							<span class="input-group-btn">
								<button class="btn btn-default" type="button">GO!</button>
							</span>
						</div>							
					</form>					
					
					<ul class="nav navbar-nav hidden-lg hidden-md hidden-sm">
						<li><a href="#">Sign in</a></li>
						<li><a href="#">Sign up</a></li>
						<li class="dropdown">
						  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Language: EN <span class="caret"></span></a>
						  <ul class="dropdown-menu" role="menu">
							  <li><a href="#">PL</a></li>
							  <li><a href="#">FR</a></li>
							  <li><a href="#">DE</a></li>
						  </ul>
						</li>
						<li class="dropdown">
						  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Currency: USD <span class="caret"></span></a>
						  <ul class="dropdown-menu" role="menu">
							  <li><a href="#">EUR</a></li>
							  <li><a href="#">PLN</a></li>
						  </ul>
						</li>
					</ul>
					
				</div>
			</nav>
			
			<ol class="breadcrumb">
				<li><a href="#">Home</a></li>
				<li><a href="#">Category</a></li>
				<li class="active">Product</li>
			</ol>
		</div>
	</header>   