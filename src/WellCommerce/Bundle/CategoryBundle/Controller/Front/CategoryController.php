<?php
/*
 * WellCommerce Open-Source E-Commerce Platform
 *
 * This file is part of the WellCommerce package.
 *
 * (c) Adam Piotrowski <adam@wellcommerce.org>
 *
 * For the full copyright and license information,
 * please view the LICENSE file that was distributed with this source code.
 */

namespace WellCommerce\Bundle\CategoryBundle\Controller\Front;

use Symfony\Component\HttpFoundation\Request;
use WellCommerce\Bundle\CoreBundle\Controller\Front\AbstractFrontController;
use WellCommerce\Bundle\CoreBundle\Controller\Front\FrontControllerInterface;

/**
 * Class CategoryController
 *
 * @package WellCommerce\Bundle\WebBundle\Controller\Front
 * @author  Adam Piotrowski <adam@wellcommerce.org>
 */
class CategoryController extends AbstractFrontController implements FrontControllerInterface
{

    public function indexAction(Request $request)
    {
        return [
            'layout' => ''
        ];
    }

}
