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

namespace WellCommerce\Bundle\CategoryBundle\Controller\Admin;

use Symfony\Component\HttpFoundation\Request;
use WellCommerce\Bundle\CoreBundle\Controller\Admin\AbstractAdminController;

/**
 * Class CategoryController
 *
 * @package WellCommerce\Bundle\CategoryBundle\Controller
 * @author  Adam Piotrowski <adam@wellcommerce.org>
 */
class CategoryController extends AbstractAdminController
{
    /**
     * @var \WellCommerce\Bundle\CategoryBundle\Repository\CategoryRepositoryInterface
     */
    protected $repository;

    public function indexAction(Request $request)
    {
        $tree = $this->getFormBuilder($this->get('category.tree'), null, [
            'name'  => 'category_tree',
            'class' => 'category-select'
        ]);

        return [
            'tree' => $tree
        ];
    }

    public function addAction(Request $request)
    {
        $category = $this->repository->quickAddCategory($request->request);

        return $this->jsonResponse([
            'id' => $category->getId()
        ]);
    }

    public function editAction(Request $request)
    {
        $resource = $this->repository->findResource($request);

        $tree = $this->getFormBuilder($this->get('category.tree'), null, [
            'name'  => 'tree',
            'class' => 'category-select'
        ]);

        $form = $this->getFormBuilder($this->get('category.form'), $resource, [
            'name' => 'category',
        ]);

        if ($form->handleRequest($request)->isValid()) {
            $this->manager->update($resource, $request);
            if ($form->isAction('continue')) {
                return $this->manager->getRedirectHelper()->redirectToAction('edit', $resource);
            }

            return $this->manager->getRedirectHelper()->redirectToAction('index');
        }

        return [
            'tree' => $tree,
            'form' => $form
        ];
    }

    public function sortAction(Request $request)
    {
        $items = $request->request->get('items');
        $this->repository->changeOrder($items);

        return $this->jsonResponse(['success' => true]);
    }
}
