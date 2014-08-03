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
namespace WellCommerce\FileManager\Repository;

use WellCommerce\Core\Repository\AbstractRepository;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use WellCommerce\FileManager\Model\File;

/**
 * Class FileAbstractRepository
 *
 * @package WellCommerce\File\AbstractRepository
 * @author  Adam Piotrowski <adam@wellcommerce.org>
 */
class FileRepository extends AbstractRepository implements FileManagerRepositoryInterface
{
    /**
     * {@inheritdoc}
     */
    public function all()
    {
        return File::all();
    }

    /**
     * {@inheritdoc}
     */
    public function find($id)
    {
        return File::findOrFail($id);
    }

    /**
     * {@inheritdoc}
     */
    public function delete($id)
    {
        $file = $this->find($id);
        $file->delete();
        $this->dispatchEvent(FileManagerRepositoryInterface::POST_DELETE_EVENT, $file);
    }

    /**
     * {@inheritdoc}
     */
    public function save(UploadedFile $uploadedFile)
    {
        $id = null;

        $data = [
            'name'      => $uploadedFile->getClientOriginalName(),
            'size'      => $uploadedFile->getClientSize(),
            'extension' => $uploadedFile->getClientOriginalExtension(),
            'type'      => $uploadedFile->getClientMimeType(),
        ];


        $file = $this->transaction(function () use ($data, $id) {

            $file = File::firstOrCreate([
                'id' => $id
            ]);

            $data = $this->dispatchEvent(FileManagerRepositoryInterface::PRE_SAVE_EVENT, $file, $data);
            $file->update($data);
            $this->dispatchEvent(FileManagerRepositoryInterface::POST_SAVE_EVENT, $file, $data);

            return $file;
        });

        return $file;
    }
}