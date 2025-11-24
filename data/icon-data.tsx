import { Sword, Shield, Heart, Sparkle, ChevronsUp, Droplet } from "lucide-react";

export const ACTION_ICONS = {
  atk: <Sword className="scale-x-[-1]" />,
  def: <Shield />,
  hp: <Heart />,
  mp: <Droplet />,
  spd: <ChevronsUp />,
  int: <Sparkle />,
  hpBff: <Heart />,
  mpBff: <Droplet />,
  spdBff: <ChevronsUp />,
  atkBff: (
    <div className="flex">
      <ChevronsUp className="size-4" />
      <Sword className="size-8" />
    </div>
  ),
  defBff: (
    <div className="flex">
      <ChevronsUp className="size-4" />
      <Shield className="size-8" />
    </div>
  ),
  intBuff: (
    <div className="flex">
      <ChevronsUp className="size-4" />
      <Sparkle className="size-8" />
    </div>
  ),
};
