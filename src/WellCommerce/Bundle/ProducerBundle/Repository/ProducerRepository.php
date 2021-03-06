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
namespace WellCommerce\Bundle\ProducerBundle\Repository;

use WellCommerce\Bundle\CoreBundle\Repository\AbstractEntityRepository;

/**
 * Class ProducerRepository
 *
 * @package WellCommerce\Bundle\ProducerBundle\Repository
 * @author  Adam Piotrowski <adam@wellcommerce.org>
 */
class ProducerRepository extends AbstractEntityRepository implements ProducerRepositoryInterface
{
    /**
     * {@inheritdoc}
     */
    public function getDataGridQueryBuilder()
    {
        return parent::getQueryBuilder()
            ->groupBy('producer.id')
            ->leftJoin(
                'WellCommerce\Bundle\ProducerBundle\Entity\ProducerTranslation',
                'producer_translation',
                'WITH',
                'producer.id = producer_translation.translatable AND producer_translation.locale = :locale');

    }
}
