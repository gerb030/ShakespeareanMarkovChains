#!/usr/bin/php
<?php
$text_file = $argv[1];
$target_file = $argv[2];
$stage_directions = array('exeunt.', '-the end-');
$skip_when_contains = array('scene', 'act');
if (!file_exists($text_file)) {
    die('file does not exist or is not readable');
}

$fn = fopen($text_file,"r");
$fw = fopen($target_file,"w");
while(! feof($fn))  {
  $line = fgets($fn);
  $skip = false;
  if (strlen(trim($line)) > 0) {
      foreach($skip_when_contains as $word) {
        if (stristr($line, $word)) {
            $skip = true;
        }
      }
      foreach($stage_directions as $word) {
        $line = str_ireplace($word, "", $line);
      }
      if (preg_match("/^\s*Enter\s+/", $line)) {
          $skip = true;
      }
      $line = preg_replace("/^\s*([A-Z ]+)\.\s+/", "", $line);
      $line = preg_replace("/\[[ \w.]+\]/", "", $line);
      if (!$skip) {
        fwrite($fw, $line);
      }
  }
}

fclose($fn);
fclose($fw);