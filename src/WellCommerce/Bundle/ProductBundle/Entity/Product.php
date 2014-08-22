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

namespace WellCommerce\Bundle\ProductBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Knp\DoctrineBehaviors\Model as ORMBehaviors;
use WellCommerce\Bundle\CategoryBundle\Entity\Category;
use WellCommerce\Bundle\CoreBundle\Entity\Behaviours\EnableableTrait;
use WellCommerce\Bundle\CoreBundle\Entity\Behaviours\MetaDataTrait;
use WellCommerce\Bundle\CoreBundle\Entity\Behaviours\PhotoTrait;
use WellCommerce\Bundle\DelivererBundle\Entity\Deliverer;
use WellCommerce\Bundle\ShopBundle\Entity\Shop;

/**
 * Class Locale
 *
 * @package WellCommerce\Bundle\ProductBundle\Entity
 * @author  Adam Piotrowski <adam@wellcommerce.org>
 *
 * @ORM\Table(name="product")
 * @ORM\HasLifecycleCallbacks
 * @ORM\Entity(repositoryClass="WellCommerce\Bundle\ProductBundle\Repository\ProductRepository")
 */
class Product
{
    use ORMBehaviors\Translatable\Translatable;
    use ORMBehaviors\Timestampable\Timestampable;
    use PhotoTrait;
    use EnableableTrait;

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(name="sku", type="string", length=64, unique=false)
     */
    private $sku;

    /**
     * @ORM\ManyToOne(targetEntity="WellCommerce\Bundle\ProducerBundle\Entity\Producer")
     * @ORM\JoinColumn(name="producer_id", referencedColumnName="id", onDelete="SET NULL")
     */
    private $producer;

    /**
     * @ORM\ManyToOne(targetEntity="WellCommerce\Bundle\TaxBundle\Entity\Tax")
     * @ORM\JoinColumn(name="tax_id", referencedColumnName="id", onDelete="SET NULL")
     */
    private $tax;

    /**
     * @ORM\ManyToOne(targetEntity="WellCommerce\Bundle\UnitBundle\Entity\Unit")
     * @ORM\JoinColumn(name="unit_id", referencedColumnName="id", onDelete="SET NULL")
     */
    private $unit;

    /**
     * @ORM\ManyToOne(targetEntity="WellCommerce\Bundle\AvailabilityBundle\Entity\Availability")
     * @ORM\JoinColumn(name="availability_id", referencedColumnName="id", onDelete="SET NULL")
     */
    private $availability;

    /**
     * @ORM\ManyToMany(targetEntity="WellCommerce\Bundle\ShopBundle\Entity\Shop", inversedBy="products")
     * @ORM\JoinTable(name="shop_product",
     *      joinColumns={@ORM\JoinColumn(name="product_id", referencedColumnName="id", onDelete="CASCADE")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="shop_id", referencedColumnName="id", onDelete="CASCADE")}
     * )
     */
    private $shops;

    /**
     * @ORM\ManyToMany(targetEntity="WellCommerce\Bundle\CategoryBundle\Entity\Category", inversedBy="products")
     * @ORM\JoinTable(name="category_product",
     *      joinColumns={@ORM\JoinColumn(name="product_id", referencedColumnName="id", onDelete="CASCADE")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="category_id", referencedColumnName="id", onDelete="CASCADE")}
     * )
     */
    private $categories;

    /**
     * @var string
     *
     * @ORM\Column(name="stock", type="decimal", precision=15, scale=4)
     */
    private $stock;

    /**
     * @var string
     *
     * @ORM\Column(name="buy_price", type="decimal", precision=15, scale=4)
     */
    private $buyPrice;

    /**
     * @var string
     *
     * @ORM\Column(name="sell_price", type="decimal", precision=15, scale=4)
     */
    private $sellPrice;

    /**
     * @ORM\ManyToOne(targetEntity="WellCommerce\Bundle\CurrencyBundle\Entity\Currency")
     * @ORM\JoinColumn(name="buy_currency_id", referencedColumnName="id", onDelete="SET NULL")
     */
    private $buyCurrency;

    /**
     * @ORM\ManyToOne(targetEntity="WellCommerce\Bundle\CurrencyBundle\Entity\Currency")
     * @ORM\JoinColumn(name="sell_currency_id", referencedColumnName="id", onDelete="SET NULL")
     */
    private $sellCurrency;

    /**
     * @var bool
     *
     * @ORM\Column(name="track_stock", type="boolean")
     */
    private $trackStock;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->shops      = new ArrayCollection();
        $this->categories = new ArrayCollection();
        $this->categories = new ArrayCollection();
    }

    /**
     * Get id.
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Returns product sku
     *
     * @return mixed
     */
    public function getSku()
    {
        return $this->sku;
    }

    /**
     * Returns products sku
     *
     * @param $sku
     */
    public function setSku($sku)
    {
        $this->sku = $sku;
    }

    /**
     * Returns product producer
     *
     * @return mixed
     */
    public function getProducer()
    {
        return $this->producer;
    }

    /**
     * Sets product producer
     *
     * @param $producer
     */
    public function setProducer($producer)
    {
        $this->producer = $producer;
    }

    /**
     * Returns product producer
     *
     * @return mixed
     */
    public function getTax()
    {
        return $this->tax;
    }

    /**
     * Sets product tax
     *
     * @param $tax
     */
    public function setTax($tax)
    {
        $this->tax = $tax;
    }

    /**
     * Returns product stock
     *
     * @return mixed
     */
    public function getStock()
    {
        return $this->stock;
    }

    /**
     * Sets product stock
     *
     * @param $stock
     */
    public function setStock($stock)
    {
        $this->stock = $stock;
    }

    /**
     * Returns product stock
     *
     * @return mixed
     */
    public function getTrackStock()
    {
        return $this->trackStock;
    }

    /**
     * Sets product stock tracking status
     *
     * @param $trackStock
     */
    public function setTrackStock($trackStock)
    {
        $this->trackStock = $trackStock;
    }

    /**
     * Returns product producer
     *
     * @return mixed
     */
    public function getUnit()
    {
        return $this->unit;
    }

    /**
     * Sets product unit
     *
     * @param $unit
     */
    public function setUnit($unit)
    {
        $this->unit = $unit;
    }

    /**
     * Returns product availability
     *
     * @return mixed
     */
    public function getAvailability()
    {
        return $this->availability;
    }

    /**
     * Sets product availability status
     *
     * @param $availability
     */
    public function setAvailability($availability)
    {
        $this->availability = $availability;
    }

    /**
     * Sets shops for category
     *
     * @param $shops
     */
    public function setShops($shops)
    {
        $this->shops = $shops;
    }

    /**
     * Get shops for category
     *
     * @return mixed
     */
    public function getShops()
    {
        return $this->shops;
    }

    /**
     * Adds product to shop
     *
     * @param Shop $shop
     */
    public function addShop(Shop $shop)
    {
        $this->shops[] = $shop;
    }

    /**
     * Returns all available categories for product
     *
     * @return ArrayCollection
     */
    public function getCategories()
    {
        return $this->categories;
    }

    /**
     * Adds new category to product
     *
     * @param Deliverer $deliverer
     */
    public function addCategory(Category $category)
    {
        $this->categories[] = $category;
    }

    /**
     * Sets product category collection
     *
     * @param ArrayCollection $collection
     */
    public function setCategories(ArrayCollection $collection)
    {
        $this->categories = $collection;
    }

    public function getBuyCurrency()
    {
        return $this->buyCurrency;
    }

    public function setBuyCurrency($buyCurrency)
    {
        $this->buyCurrency = $buyCurrency;
    }

    public function getSellCurrency()
    {
        return $this->sellCurrency;
    }

    public function setSellCurrency($sellCurrency)
    {
        $this->sellCurrency = $sellCurrency;
    }

    public function getSellPrice()
    {
        return $this->sellPrice;
    }

    public function setSellPrice($sellPrice)
    {
        $this->sellPrice = $sellPrice;
    }

    public function getBuyPrice()
    {
        return $this->buyPrice;
    }

    public function setBuyPrice($buyPrice)
    {
        $this->buyPrice = $buyPrice;
    }
}
