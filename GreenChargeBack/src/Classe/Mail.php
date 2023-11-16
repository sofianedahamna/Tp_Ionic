<?php

namespace App\Classe;
use Mailjet\Client;
use Mailjet\Resources;

class Mail
{
    private $api_key = "07917c073e5edd0c8916d259934e573d";
    private $api_key_secret = "a46dcde5b52ab833116c17eba671dfcd";


    public function send($to_email,$subject,$content)
    {

        $mj = new Client($this->api_key, $this->api_key_secret, true, [
        'version' => 'v3.1',
        'timeout' => 10 
        ]);
        $body = [
            'Messages' => [
                [
                    'From' => [
                        'Email' => "dahamnasofiane@gmail.com",
                        'Name' => "Greencharge"
                    ],
                    'To' => [
                        [
                            'Email' => $to_email,
                        ]
                    ],
                        "TemplateID"=> 4588784,
						"TemplateLanguage"=> true,
						"Subject"=> $subject,
                        'Variables'=>[
                            'content'=> $content,
                        ]
                ]
            ]
        ];
        $response = $mj->post(Resources::$Email, ['body' => $body]);
        $response->success();
    }
}
