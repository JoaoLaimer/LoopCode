import Checkbox from "@mui/material/Checkbox";
import Image from "next/image";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function Home() {
  return (
    <div>
      <Image src="/images/gato.jpg" alt="image" width={500} height={300} />
      <div>
        <Checkbox {...label} defaultChecked />
        <Checkbox {...label} />
        <Checkbox {...label} disabled />
        <Checkbox {...label} disabled checked />
      </div>
    </div>
  );
}
