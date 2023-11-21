<?php

namespace App\Entity;

use App\Repository\ChargingPointRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ChargingPointRepository::class)]
class ChargingPoint
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["chargingPoint_simple"])]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    #[Groups(["chargingPoint_simple"])]
    private ?string $name = null;

    #[ORM\Column(length: 50)]
    #[Groups(["chargingPoint_simple"])]
    private ?string $status = null;

    #[ORM\Column]
    #[Groups(["chargingPoint_simple"])]
    private ?float $ratePerHour = null;

    #[ORM\Column(length: 50)]
    #[Groups(["chargingPoint_simple"])]
    private ?string $plugType = null;

    #[ORM\Column(length: 255)]
    #[Groups(["chargingPoint_simple"])]
    private ?string $acessinstruction = null;

    #[ORM\Column(nullable: true)]
    #[Groups(["chargingPoint_simple"])]
    private ?int $powerKw = null;

    #[ORM\ManyToOne(inversedBy: 'chargingPoints')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["chargingPoint_simple"])]
    private ?Adress $AdressId = null;

    #[ORM\ManyToOne(inversedBy: 'chargingPoints')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Users $UsersId = null;

    #[ORM\OneToMany(mappedBy: 'chargingpoint', targetEntity: Availabilities::class, cascade: ['remove'])]
    #[Groups(["chargingPoint_simple"])]
    private Collection $availabilities;

    #[ORM\OneToMany(mappedBy: 'chargingpoint', targetEntity: Evaluation::class)]
    private Collection $evaluations;

    #[ORM\OneToMany(mappedBy: 'chargingpoint', targetEntity: Reservation::class)]
    private Collection $reservations;

    public function __construct()
    {
        $this->availabilities = new ArrayCollection();
        $this->evaluations = new ArrayCollection();
        $this->reservations = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getRatePerHour(): ?float
    {
        return $this->ratePerHour;
    }

    public function setRatePerHour(float $ratePerHour): static
    {
        $this->ratePerHour = $ratePerHour;

        return $this;
    }

    public function getPlugType(): ?string
    {
        return $this->plugType;
    }

    public function setPlugType(string $plugType): static
    {
        $this->plugType = $plugType;

        return $this;
    }

    public function getAcessinstruction(): ?string
    {
        return $this->acessinstruction;
    }

    public function setAcessinstruction(string $acessinstruction): static
    {
        $this->acessinstruction = $acessinstruction;

        return $this;
    }

    public function getPowerKw(): ?int
    {
        return $this->powerKw;
    }

    public function setPowerKw(?int $powerKw): static
    {
        $this->powerKw = $powerKw;

        return $this;
    }

    public function getAdressId(): ?adress
    {
        return $this->AdressId;
    }

    public function setAdressId(?adress $AdressId): static
    {
        $this->AdressId = $AdressId;

        return $this;
    }

    public function getUsersId(): ?Users
    {
        return $this->UsersId;
    }

    public function getUserIdValue(): ?int
    {
        return $this->UsersId ? $this->UsersId->getId() : null;
    }

    public function setUsersId(?Users $UsersId): static
    {
        $this->UsersId = $UsersId;

        return $this;
    }

    /**
     * @return Collection<int, Availabilities>
     */
    public function getAvailabilities(): Collection
    {
        return $this->availabilities;
    }

    public function addAvailability(Availabilities $availability): static
    {
        if (!$this->availabilities->contains($availability)) {
            $this->availabilities->add($availability);
            $availability->setChargingpoint($this);
        }

        return $this;
    }

    public function removeAvailability(Availabilities $availability): static
    {
        if ($this->availabilities->removeElement($availability)) {
            // set the owning side to null (unless already changed)
            if ($availability->getChargingpoint() === $this) {
                $availability->setChargingpoint(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Evaluation>
     */
    public function getEvaluations(): Collection
    {
        return $this->evaluations;
    }

    public function addEvaluation(Evaluation $evaluation): static
    {
        if (!$this->evaluations->contains($evaluation)) {
            $this->evaluations->add($evaluation);
            $evaluation->setChargingpoint($this);
        }

        return $this;
    }

    public function removeEvaluation(Evaluation $evaluation): static
    {
        if ($this->evaluations->removeElement($evaluation)) {
            // set the owning side to null (unless already changed)
            if ($evaluation->getChargingpoint() === $this) {
                $evaluation->setChargingpoint(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Reservation>
     */
    public function getReservations(): Collection
    {
        return $this->reservations;
    }

    public function addReservation(Reservation $reservation): static
    {
        if (!$this->reservations->contains($reservation)) {
            $this->reservations->add($reservation);
            $reservation->setChargingpoint($this);
        }

        return $this;
    }

    public function removeReservation(Reservation $reservation): static
    {
        if ($this->reservations->removeElement($reservation)) {
            // set the owning side to null (unless already changed)
            if ($reservation->getChargingpoint() === $this) {
                $reservation->setChargingpoint(null);
            }
        }

        return $this;
    }
}
