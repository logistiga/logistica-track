<?php

namespace App\Services;

/**
 * Backward-compatibility shim.
 * This class preserves the old name used before refactoring.
 * It simply extends DetentionService so existing type hints continue to work
 * without requiring an immediate composer dump-autoload on all environments.
 */
class DetentionCalculationService extends DetentionService
{
    // No extra logic. All functionality is inherited from DetentionService.
}
