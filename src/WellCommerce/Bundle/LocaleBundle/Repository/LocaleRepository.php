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
namespace WellCommerce\Bundle\LocaleBundle\Repository;

use Doctrine\ORM\EntityRepository;
use Symfony\Component\Intl\Intl;
use WellCommerce\Bundle\CoreBundle\DataGrid\Repository\DataGridRepositoryInterface;
use WellCommerce\Bundle\LocaleBundle\Repository\LocaleRepositoryInterface;

/**
 * LocaleRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class LocaleRepository extends EntityRepository implements DataGridRepositoryInterface, LocaleRepositoryInterface
{
    /**
     * {@inheritdoc}
     */
    public function deleteRow($id)
    {
        $entity = $this->find($id);
        $this->_em->remove($entity);
        $this->_em->flush();
    }

    /**
     * {@inheritdoc}
     */
    public function updateRow(array $request)
    {

    }

    /**
     * {@inheritdoc}
     */
    public function deleteMultipleRows(array $ids)
    {
        return false;
    }

    /**
     * Returns locales as list containing  key-value pairs
     *
     * @return array
     */
    public function getLocalesFlattened()
    {
        $locales = $this->findAll();
        $data    = [];
        foreach ($locales as $locale) {
            $data[$locale->getId()] = $locale->getCode();
        }

        return $data;
    }

    public function getLocaleNames()
    {
        $locales = Intl::getLocaleBundle()->getLocaleNames();

        $Data = [];

        foreach ($locales as $locale => $name) {
            $Data[$locale] = sprintf('%s (%s)', $name, $locale);
        }

        return $Data;
    }
}