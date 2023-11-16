<?php

namespace App\Entity;

use App\Repository\AdressRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AdressRepository::class)]
class Adress
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 10)]
    #[Groups(["chargingPoint_simple"])]
    private ?string $streetNumber = null;

    #[ORM\Column(length: 255)]
    #[Groups(["chargingPoint_simple"])]
    private ?string $street = null;

    #[ORM\Column(length: 255)]
    #[Groups(["chargingPoint_simple"])]
    private ?string $city = null;

    #[ORM\Column(length: 50)]
    private ?string $state = null;

    #[ORM\Column(length: 10)]
    #[Groups(["chargingPoint_simple"])]
    private ?string $postCode = null;

    #[ORM\Column(length: 50)]
    #[Groups(["chargingPoint_simple"])]
    private ?string $country = null;

    #[ORM\Column(length: 50)]
    private ?string $title = null;

    #[ORM\Column(nullable: true)]
    #[Groups(["chargingPoint_simple"])]
    private ?float $longitude = null;

    #[ORM\Column(nullable: true)]
    #[Groups(["chargingPoint_simple"])]
    private ?float $latitude = null;

    #[ORM\OneToMany(mappedBy: 'adressId', targetEntity: Users::class)]
    private Collection $users;

    #[ORM\OneToMany(mappedBy: 'AdressId', targetEntity: ChargingPoint::class)]
    private Collection $chargingPoints;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->chargingPoints = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStreetNumber(): ?string
    {
        return $this->streetNumber;
    }

    public function setStreetNumber(string $streetNumber): static
    {
        $this->streetNumber = $streetNumber;

        return $this;
    }

    public function getStreet(): ?string
    {
        return $this->street;
    }

    public function setStreet(string $street): static
    {
        $this->street = $street;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): static
    {
        $this->city = $city;

        return $this;
    }

    public function getState(): ?string
    {
        return $this->state;
    }

    public function setState(string $state): static
    {
        $this->state = $state;

        return $this;
    }

    public function getPostCode(): ?string
    {
        return $this->postCode;
    }

    public function setPostCode(string $postCode): static
    {
        $this->postCode = $postCode;

        return $this;
    }

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(string $country): static
    {
        $this->country = $country;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getLongitude(): ?float
    {
        return $this->longitude;
    }

    public function setLongitude(?float $longitude): static
    {
        $this->longitude = $longitude;

        return $this;
    }

    public function getLatitude(): ?float
    {
        return $this->latitude;
    }

    public function setLatitude(?float $latitude): static
    {
        $this->latitude = $latitude;

        return $this;
    }

    /**
     * @return Collection<int, Users>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(Users $user): static
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
            $user->setAdressId($this);
        }

        return $this;
    }

    public function removeUser(Users $user): static
    {
        if ($this->users->removeElement($user)) {
            // set the owning side to null (unless already changed)
            if ($user->getAdressId() === $this) {
                $user->setAdressId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ChargingPoint>
     */
    public function getChargingPoints(): Collection
    {
        return $this->chargingPoints;
    }

    public function addChargingPoint(ChargingPoint $chargingPoint): static
    {
        if (!$this->chargingPoints->contains($chargingPoint)) {
            $this->chargingPoints->add($chargingPoint);
            $chargingPoint->setAdressId($this);
        }

        return $this;
    }

    public function removeChargingPoint(ChargingPoint $chargingPoint): static
    {
        if ($this->chargingPoints->removeElement($chargingPoint)) {
            // set the owning side to null (unless already changed)
            if ($chargingPoint->getAdressId() === $this) {
                $chargingPoint->setAdressId(null);
            }
        }

        return $this;
    }
}
