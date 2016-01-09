<?php


trait validateData
{
    public function clean($value = "") {
        $value = strip_tags(trim($value));
        return $value;
    }

    public function checkLength($value = "", $min, $max) {
        $result = (mb_strlen($value, 'UTF-8') < $min || mb_strlen($value, 'UTF-8') > $max);
        return !$result;
    }
}