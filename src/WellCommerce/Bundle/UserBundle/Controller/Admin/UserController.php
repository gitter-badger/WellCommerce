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

namespace WellCommerce\Bundle\UserBundle\Controller\Admin;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\SecurityContext;
use Symfony\Component\Security\Core\SecurityContextInterface;
use WellCommerce\Bundle\CoreBundle\Controller\Admin\AbstractAdminController;

/**
 * Class UserController
 *
 * @package WellCommerce\Bundle\UserBundle\Controller
 * @author  Adam Piotrowski <adam@wellcommerce.org>
 */
class UserController extends AbstractAdminController
{
    public function loginAction(Request $request)
    {
        $session = $request->getSession();

        if ($request->attributes->has(SecurityContextInterface::AUTHENTICATION_ERROR)) {
            $error = $request->attributes->get(
                SecurityContextInterface::AUTHENTICATION_ERROR
            );
        } elseif (null !== $session && $session->has(SecurityContextInterface::AUTHENTICATION_ERROR)) {
            $error = $session->get(SecurityContextInterface::AUTHENTICATION_ERROR);
            $session->remove(SecurityContextInterface::AUTHENTICATION_ERROR);
        } else {
            $error = '';
        }


        $form = $this->getFormBuilder($this->get('user.form.login'), null, [
            'name'   => 'login',
            'action' => $this->generateUrl('admin.user.login_check'),
            'class'  => 'login-form'
        ]);

        return [
            'error' => $error,
            'form'  => $form
        ];
    }

    public function loginCheckAction(Request $request)
    {
    }

    public function deleteAction($id)
    {
        $user = $this->getUser();
        if ($user->getId() == $id) {
            return new JsonResponse(['error' => 'You cannot delete your own admin account.']);
        }

        $em = $this->getEntityManager();

        try {
            $resource = $this->repository->find($id);
            $em->remove($resource);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()]);
        }

        $em->flush();

        return new JsonResponse(['success' => true]);
    }
}
