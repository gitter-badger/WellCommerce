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
namespace WellCommerce\Bundle\IntlBundle\Repository;

use WellCommerce\Bundle\CoreBundle\Repository\AbstractEntityRepository;

/**
 * Class DictionaryRepository
 *
 * @package WellCommerce\Bundle\IntlBundle\Repository
 * @author  Adam Piotrowski <adam@wellcommerce.org>
 */
class DictionaryRepository extends AbstractEntityRepository implements DictionaryRepositoryInterface
{
    /**
     * @var array
     */
    private $domains = ['admin', 'front', 'flashes', 'validators'];

    /**
     * Returns possible translation domains
     *
     * @return array
     */
    public function getTranslationDomains()
    {
        $domains = [];
        foreach ($this->domains as $domain) {
            $domains[$domain] = $domain;
        }

        return $domains;
    }

    /**
     * {@inheritdoc}
     */
    public function getDataGridQueryBuilder()
    {
        return parent::getQueryBuilder()->groupBy('dictionary.id')
            ->leftJoin(
                'WellCommerce\Bundle\IntlBundle\Entity\DictionaryTranslation',
                'dictionary_translation',
                'WITH',
                'dictionary.id = dictionary_translation.translatable AND dictionary_translation.locale = :locale');
    }
}
