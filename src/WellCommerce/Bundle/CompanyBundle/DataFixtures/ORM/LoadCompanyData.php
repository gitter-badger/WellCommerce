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

namespace WellCommerce\Bundle\CompanyBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use WellCommerce\Bundle\CompanyBundle\Entity\Company;

class LoadCompanyData implements FixtureInterface
{
    /**
     * {@inheritDoc}
     */
    public function load(ObjectManager $manager)
    {
        $company = new Company();
        $company->setName('Your Company Inc.');
        $company->setShortName('Company');
        $company->setCountry('US');
        $company->setStreet('E-Commerce Blvd.');
        $company->setStreetNo('111');
        $company->setFlatNo('22');
        $company->setPostCode('00000');
        $company->setCity('Los Angeles');
        $manager->persist($company);
        $manager->flush();
    }
}