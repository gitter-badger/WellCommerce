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

namespace WellCommerce\Bundle\AttributeBundle\Repository;

use Symfony\Component\HttpFoundation\ParameterBag;
use WellCommerce\Bundle\CoreBundle\Repository\RepositoryInterface;

/**
 * Interface AttributeGroupRepositoryInterface
 *
 * @package WellCommerce\Bundle\AttributeBundle\Repository
 * @author  Adam Piotrowski <adam@wellcommerce.org>
 */
interface AttributeGroupRepositoryInterface extends RepositoryInterface
{
    /**
     * Returns all groups with translations
     *
     * @return mixed
     */
    public function findAll();

    /**
     * Adds new attribute group
     *
     * @param ParameterBag $parameters
     *
     * @return mixed
     */
    public function addAttributeGroup(ParameterBag $parameters);
} 