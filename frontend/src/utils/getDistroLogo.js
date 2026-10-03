export const getDistroLogo = (distro) => {
  if (!distro) return "";

  const name = distro.name?.toLowerCase() || "";
  const osType = distro.os_type?.toLowerCase() || "";

  if (osType === "windows") {
    if (name.includes("11")) {
      return "/windows_logos/windows_11.png";
    } else if (name.includes("10")) {
      return "/windows_logos/windows_10.svg";
    } else if (name.includes("2022")) {
      return "/windows_logos/Windows_Server_2022.png";
    }
  }

  const identifier = distro.logo_name || distro.name?.toLowerCase().replace(/\s/g, "");
  return `https://distrowatch.com/images/yvzhuwbpy/${identifier}.png`;
};
