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

namespace WellCommerce\Bundle\DelivererBundle\Repository;

use WellCommerce\Bundle\CoreBundle\Repository\RepositoryInterface;
use WellCommerce\Bundle\DataGridBundle\DataGrid\Repository\DataGridAwareRepositoryInterface;

/**
 * Interface LocaleRepositoryInterface
 *
 * @package WellCommerce\Bundle\DelivererBundle\Repository
 * @author  Adam Piotrowski <adam@wellcommerce.org>
 */
interface DelivererRepositoryInterface extends RepositoryInterface, DataGridAwareRepositoryInterface
{

} 