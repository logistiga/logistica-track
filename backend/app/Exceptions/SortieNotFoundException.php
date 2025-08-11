<?php

namespace App\Exceptions;

use Exception;

class SortieNotFoundException extends Exception
{
    public function __construct($message = "Sortie de conteneur non trouvée")
    {
        parent::__construct($message);
    }
}