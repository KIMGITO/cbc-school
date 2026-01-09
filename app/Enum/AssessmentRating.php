<?php

namespace App\Enum;

enum AssessmentRating: string
{
    case EE = "exceeding expectations";
    case ME = "meeting expectations";
    case AE = "approaching expectations";
    case BE = "below expectations";
}
