(function () {
  "use strict";

  var KRAJE = {
  BA: { name: "Bratislava",      m2: 4500, hist: 8.5, rent2i: 870 },
  TT: { name: "Trnava",          m2: 2900, hist: 8.5, rent2i: 680 },
  TN: { name: "Trenčín",         m2: 2600, hist: 8.0, rent2i: 551 },
  NR: { name: "Nitra",           m2: 2700, hist: 8.0, rent2i: 640 },
  ZA: { name: "Žilina",          m2: 3400, hist: 9.0, rent2i: 640 },
  BB: { name: "Banská Bystrica", m2: 2800, hist: 8.5, rent2i: 620 },
  PO: { name: "Prešov",          m2: 2700, hist: 9.5, rent2i: 590 },
  KE: { name: "Košice",          m2: 3500, hist: 9.5, rent2i: 720 },
};

  var TYPY = {
  G:    { name: "Garsónka",      short: "Garsónka",  m: 26, pk: 1.18, rk: 0.65, cm: 110 },
  "1i": { name: "1-izbový byt",  short: "1-izbový",  m: 36, pk: 1.12, rk: 0.80, cm: 130 },
  "2i": { name: "2-izbový byt",  short: "2-izbový",  m: 56, pk: 1.00, rk: 1.00, cm: 160 },
  "3i": { name: "3-izbový byt",  short: "3-izbový",  m: 72, pk: 0.95, rk: 1.30, cm: 190 },
  "4i": { name: "4-izbový byt",  short: "4-izbový",  m: 90, pk: 0.92, rk: 1.60, cm: 220 },
};

  var MAP_PATHS = {
  BA: "M88.1,254.5L93.5,259.4L94.8,264.8L91.9,270.2L87.4,274.3L85.7,273.8L87.2,277.5L84.9,276.4L76.5,284.2L77.9,282.9L81.5,284.8L86.0,290.5L91.0,292.6L87.8,295.0L87.6,299.0L83.9,299.4L81.8,303.4L84.4,307.2L89.5,307.1L92.2,310.6L97.8,310.9L95.4,313.1L97.1,315.7L99.6,316.2L99.0,319.2L101.9,319.5L100.7,320.7L103.1,323.0L103.5,327.4L105.4,328.7L108.0,327.5L112.4,333.3L109.7,340.6L107.5,342.1L109.3,345.7L110.4,344.6L111.4,347.1L118.7,352.8L111.6,364.4L119.9,366.9L116.4,372.3L121.4,374.6L118.8,380.3L117.5,379.9L116.3,382.0L113.0,381.5L112.9,384.0L107.0,388.0L98.6,385.9L100.6,382.9L98.9,380.5L98.2,382.1L95.4,381.6L94.3,386.2L97.3,388.8L95.2,392.0L93.1,391.2L88.5,395.2L82.2,394.0L83.8,396.0L82.7,400.3L86.1,403.0L89.0,401.1L90.8,402.2L83.9,410.7L80.8,409.0L81.7,414.7L78.2,415.2L76.1,419.0L73.3,418.9L74.2,420.5L72.2,423.3L71.3,420.6L68.6,422.2L64.0,421.3L57.1,424.8L54.2,421.2L51.2,421.0L48.3,418.3L44.8,421.3L40.8,418.2L44.4,414.5L41.0,411.9L44.2,409.3L41.7,407.9L42.9,405.8L41.6,405.1L45.3,402.4L45.3,400.2L40.0,394.4L41.1,393.7L39.1,388.5L34.1,389.4L24.9,381.0L22.3,367.7L19.7,364.2L21.6,356.9L15.9,354.8L13.1,350.5L10.7,344.0L13.1,340.3L6.7,337.2L6.9,334.3L1.6,333.2L0.0,325.8L3.0,325.2L3.0,318.2L5.3,315.6L2.8,308.2L5.2,306.8L4.6,305.1L8.3,300.3L9.9,300.6L10.0,296.3L11.6,294.9L14.6,295.6L13.9,292.4L15.4,289.1L19.1,288.7L20.3,284.9L24.0,284.4L23.3,281.9L39.3,279.7L38.2,277.5L44.9,278.9L47.2,277.6L50.9,282.0L70.2,276.6L70.0,273.0L75.4,270.7L78.4,265.7L80.8,266.0L86.2,253.7L88.1,254.5Z",
  TT: "M67.1,196.4L77.6,199.1L82.5,203.6L85.2,203.1L85.7,205.5L92.2,211.5L95.1,210.0L98.2,211.6L97.4,216.4L91.2,219.8L91.4,221.8L97.4,222.5L100.8,218.3L102.7,219.3L103.7,223.3L111.6,225.4L115.0,232.5L114.1,235.2L112.0,235.3L110.4,241.5L112.7,243.1L111.9,246.0L116.5,250.6L117.3,255.3L122.1,260.9L127.0,256.1L129.9,258.0L138.2,256.2L136.5,252.1L138.1,248.9L139.7,251.7L143.0,251.3L142.1,250.1L145.8,250.3L151.5,246.1L159.0,254.4L165.6,257.8L172.2,257.5L172.4,253.9L175.5,254.5L177.6,259.2L180.0,257.7L182.7,260.6L185.4,259.4L187.1,261.1L196.0,262.1L197.2,264.9L199.9,264.6L201.0,267.5L199.1,270.3L194.8,270.4L195.3,272.4L189.5,272.7L185.5,269.9L181.1,278.1L180.0,285.7L176.6,288.7L176.8,290.7L188.8,296.2L197.2,304.7L194.0,307.8L193.9,310.0L191.7,309.7L186.9,321.8L180.9,332.0L178.3,333.9L179.2,337.4L177.3,338.8L176.9,345.5L174.5,347.7L175.3,350.0L179.1,350.6L180.1,352.3L177.5,357.5L179.0,359.8L176.7,361.5L183.0,371.4L175.2,378.2L172.2,373.4L168.8,375.9L173.7,382.3L169.8,386.7L164.9,384.7L160.8,387.3L164.7,389.6L172.1,398.6L169.6,407.9L171.2,409.2L176.2,406.2L177.6,408.2L175.4,409.8L182.8,414.7L183.4,417.5L180.6,420.6L182.7,429.7L181.4,436.2L183.6,441.7L181.1,445.6L184.2,449.4L176.7,455.1L174.4,459.6L170.0,460.7L168.0,464.9L167.9,473.2L163.5,475.6L162.1,478.8L157.8,477.1L156.4,478.1L156.4,485.8L152.1,490.2L135.1,473.6L128.0,475.3L121.0,462.1L115.9,461.5L108.1,456.7L104.5,447.5L99.0,439.9L94.6,437.3L87.5,428.4L78.0,428.1L72.3,425.3L74.2,420.5L73.3,418.9L76.1,419.0L78.2,415.2L82.5,413.4L80.8,409.0L83.9,410.7L90.8,402.2L89.0,401.1L86.1,403.0L82.7,400.3L83.8,396.0L82.2,394.0L88.5,395.2L93.1,391.2L95.2,392.0L97.3,388.8L95.0,387.6L95.6,384.9L94.4,384.1L95.4,381.6L98.2,382.1L98.9,380.5L100.6,382.9L99.1,386.3L102.5,386.1L105.0,388.4L110.6,386.3L113.0,381.5L116.3,382.0L117.5,379.9L118.8,380.3L121.4,374.6L116.4,372.3L119.9,366.9L111.6,364.4L118.7,352.8L111.4,347.1L110.4,344.6L109.3,345.7L107.5,342.1L109.7,340.6L112.4,333.3L108.0,327.5L105.4,328.7L103.5,327.4L103.1,323.0L100.7,320.7L101.9,319.5L99.0,319.2L99.6,316.2L97.1,315.7L95.4,313.1L97.8,312.1L97.6,310.6L92.2,310.6L89.5,307.1L84.4,307.2L81.8,303.4L83.9,299.4L87.6,299.0L87.8,295.0L91.0,292.6L86.0,290.5L81.5,284.8L77.9,282.9L76.5,284.2L84.9,276.4L87.2,277.5L85.7,273.8L88.6,273.4L94.6,266.0L93.5,259.4L90.4,255.4L89.4,256.3L86.2,253.7L80.8,266.0L78.4,265.7L75.4,270.7L70.0,273.0L70.2,276.6L50.9,282.0L47.2,277.6L44.9,278.9L38.2,277.5L39.3,279.7L26.1,280.7L23.3,281.9L24.0,284.4L20.3,284.9L21.0,282.6L17.9,275.5L17.5,267.8L18.7,263.6L22.5,259.4L23.4,250.1L28.6,243.7L28.7,239.2L37.1,224.0L44.5,219.0L47.6,213.0L48.5,206.8L55.8,203.3L62.6,195.3L64.3,194.4L67.1,196.4Z",
  TN: "M265.6,77.7L268.7,77.9L269.3,82.0L278.3,94.3L278.1,96.7L282.2,104.5L281.5,106.1L284.5,108.2L285.2,112.2L300.4,121.3L300.1,123.4L303.8,124.4L303.8,129.4L306.5,131.1L300.7,139.1L304.8,139.6L308.0,143.0L308.1,155.9L302.9,162.7L296.1,164.3L292.4,166.9L290.3,171.9L284.6,173.8L284.5,175.4L286.7,178.0L294.8,178.9L301.4,175.5L304.3,169.8L307.0,173.6L308.4,173.7L308.8,171.8L312.9,171.5L319.6,173.8L324.7,173.0L329.2,178.7L324.6,182.0L324.6,186.4L327.0,189.1L324.8,193.8L325.3,202.5L334.8,208.0L335.1,210.4L339.2,211.7L337.8,213.3L339.7,214.0L339.1,217.6L347.4,227.4L347.7,231.9L342.4,241.4L339.7,243.2L336.6,242.3L332.9,251.6L328.1,255.2L328.8,260.6L318.1,257.4L308.6,269.8L307.8,274.5L304.3,273.9L302.5,276.7L296.1,278.2L291.8,277.9L290.4,276.3L288.5,281.3L285.2,282.1L280.8,286.6L275.8,288.8L267.3,296.0L267.4,298.2L264.6,294.1L262.9,297.1L257.9,295.2L256.5,289.0L249.9,280.6L243.1,279.9L244.6,276.6L242.6,276.7L240.9,274.1L244.9,271.2L248.2,265.5L243.2,260.2L238.3,259.3L235.7,255.7L232.3,256.6L221.9,242.3L220.4,243.8L210.8,240.1L208.4,240.9L207.3,237.7L202.0,240.0L202.5,246.3L207.6,257.8L206.3,261.8L204.2,260.2L202.8,263.3L201.8,262.5L199.9,264.6L197.2,264.9L196.0,262.1L187.1,261.1L185.6,259.4L182.7,260.6L180.0,257.7L177.6,259.2L175.5,254.5L172.7,253.9L172.2,257.5L166.7,258.2L159.0,254.4L151.5,246.1L145.8,250.3L142.1,250.1L143.0,251.3L139.7,251.7L138.1,248.9L136.5,252.1L138.2,256.2L129.9,258.0L127.0,256.1L122.1,260.9L117.3,255.3L116.5,250.6L111.9,246.0L112.7,243.1L110.4,241.5L112.0,235.3L114.1,235.2L115.0,232.5L111.6,225.4L103.7,223.3L101.6,218.5L96.6,222.7L91.4,221.8L91.2,219.8L97.2,216.7L99.3,209.7L102.1,207.3L103.6,208.1L105.1,204.4L106.5,205.1L107.7,202.9L112.4,204.2L118.0,209.9L119.6,207.3L119.1,210.1L121.3,211.9L125.6,209.9L125.8,206.7L128.6,208.8L131.8,208.4L134.1,204.3L137.4,204.0L139.5,200.6L151.8,199.1L165.6,184.2L165.4,182.0L176.9,181.3L180.7,182.7L183.5,181.3L188.5,159.3L190.3,156.9L202.0,154.7L207.8,156.6L208.7,155.1L213.5,154.7L220.1,146.7L219.5,144.4L223.8,137.9L222.8,132.2L224.9,131.0L222.2,126.8L224.3,121.8L227.4,119.7L226.4,112.3L230.6,105.1L230.8,101.6L228.7,101.6L229.1,97.2L235.7,90.9L235.6,86.4L246.8,84.3L265.6,77.7Z",
  NR: "M204.7,237.8L207.8,237.9L208.4,240.9L210.8,240.1L218.9,243.6L221.9,242.3L232.3,256.6L235.7,255.7L238.3,259.3L243.2,260.2L248.2,265.5L241.0,274.8L244.6,276.6L243.9,280.8L247.6,279.6L253.4,283.6L257.9,295.2L262.9,297.1L264.6,294.1L267.4,298.2L267.3,296.0L287.0,281.5L291.2,287.5L293.9,286.7L290.8,288.8L287.5,294.4L290.0,294.5L290.1,292.6L292.8,291.8L297.4,293.5L296.2,301.2L298.9,300.5L294.4,307.3L296.4,307.1L296.9,310.4L298.7,311.3L297.6,316.2L301.3,316.0L304.1,327.2L302.4,331.7L297.2,336.3L297.1,338.8L295.0,338.6L298.0,340.1L296.6,341.3L297.3,344.6L303.6,334.5L310.4,335.7L314.3,333.0L317.4,333.8L317.4,335.3L321.4,332.7L322.0,327.7L323.7,327.5L325.3,322.6L331.1,316.4L334.0,316.7L340.3,326.9L344.9,328.6L347.3,338.6L348.8,341.7L351.0,341.8L352.2,345.7L350.0,351.1L350.2,355.7L345.6,358.2L344.1,361.7L346.7,364.3L344.6,365.8L348.6,372.0L342.8,377.0L344.6,383.0L346.8,382.6L348.7,379.6L355.6,382.4L356.8,385.2L358.3,383.7L366.1,384.6L366.4,380.5L369.0,380.8L370.8,378.3L379.5,375.4L381.4,376.5L386.7,372.5L390.6,375.2L388.8,376.8L390.3,377.9L388.1,379.6L388.3,383.0L386.6,384.1L389.6,390.8L380.3,401.9L379.5,408.0L377.4,408.5L374.6,412.4L368.2,411.0L362.1,413.0L358.2,411.0L356.1,414.2L351.0,412.6L348.9,413.8L346.6,416.0L347.7,418.0L345.8,420.9L345.9,428.2L342.9,430.5L337.6,430.5L335.2,433.1L339.0,438.1L338.6,444.4L335.7,448.4L336.8,460.5L346.9,466.0L348.2,470.6L352.8,472.1L351.5,475.2L341.6,473.4L332.5,475.9L330.0,482.4L318.8,489.8L311.6,490.7L302.3,488.4L289.1,491.9L282.3,488.6L278.5,491.1L254.1,497.6L248.1,495.5L233.7,495.0L219.2,490.9L209.7,490.9L203.6,493.3L198.4,490.8L193.8,494.0L186.7,495.2L179.4,493.8L165.4,495.4L162.4,492.9L152.1,490.2L156.4,485.8L156.4,478.1L157.8,477.1L162.1,478.8L163.5,475.6L167.9,473.2L168.0,464.9L170.0,460.7L174.4,459.6L176.7,455.1L184.2,449.4L181.1,445.6L183.6,441.7L181.4,436.2L182.7,429.7L180.6,420.6L183.4,417.5L182.8,414.7L175.4,409.8L177.6,408.2L176.2,406.2L171.2,409.2L169.6,407.9L172.1,398.6L164.7,389.6L160.8,387.3L164.9,384.7L169.8,386.7L173.7,382.3L168.8,375.9L172.2,373.4L175.2,378.2L183.0,371.4L176.7,361.5L179.0,359.8L177.5,357.5L180.1,352.3L179.1,350.6L175.3,350.0L174.5,347.7L176.9,345.5L177.3,338.8L179.2,337.4L178.3,333.9L180.9,332.0L186.9,321.8L191.7,309.7L193.9,310.0L197.4,303.7L184.3,293.1L176.8,290.7L176.6,288.7L180.0,285.7L181.1,278.1L185.5,269.9L189.5,272.7L195.3,272.4L194.8,270.4L200.6,268.9L199.9,264.6L201.8,262.5L202.8,263.3L204.8,261.2L203.9,260.5L206.3,261.8L207.6,257.8L203.3,248.9L202.0,241.3L204.7,237.8Z",
  ZA: "M456.2,0.0L459.6,0.1L460.8,2.7L459.7,4.6L461.8,7.1L470.3,10.8L470.5,20.6L479.4,41.9L482.2,41.0L484.7,44.1L489.8,41.3L489.2,45.8L491.1,47.2L488.1,54.0L497.5,55.6L503.2,60.1L508.2,54.4L515.9,53.7L516.2,62.2L518.2,65.5L516.6,71.2L518.4,77.2L516.3,83.2L519.2,84.2L521.5,89.1L516.2,91.4L514.9,97.0L511.7,99.7L510.5,106.4L514.7,109.5L518.9,107.9L522.7,108.9L524.7,111.3L529.7,110.5L531.7,108.2L535.0,109.3L534.6,113.2L537.6,114.2L539.0,121.2L534.1,127.5L537.3,130.2L539.7,124.7L545.1,124.2L552.5,119.2L549.1,125.1L546.1,125.5L543.5,128.5L543.3,130.7L544.3,133.4L547.3,131.1L548.1,133.6L550.8,133.3L550.5,134.4L559.0,133.6L557.7,141.7L555.8,143.5L557.1,147.5L554.7,152.7L555.1,158.0L549.3,159.0L547.0,157.9L546.2,160.6L550.4,163.2L556.5,171.1L555.9,175.4L558.1,179.7L563.0,180.1L560.2,183.6L555.1,186.1L551.1,186.7L548.4,184.5L544.1,186.8L531.7,186.1L524.2,187.6L520.5,184.3L507.9,189.5L499.4,182.5L495.8,183.9L487.9,178.2L473.3,177.6L472.2,176.2L468.2,178.4L463.6,177.2L454.9,181.4L445.1,181.8L439.1,189.3L435.7,190.2L432.6,197.5L429.6,199.3L422.1,200.3L424.5,197.9L424.3,192.9L420.6,190.0L409.9,193.9L406.5,192.8L404.8,194.5L403.1,193.4L392.1,195.4L386.2,193.0L382.0,195.2L380.9,200.4L377.0,202.6L378.5,209.1L376.4,213.5L380.8,218.3L378.0,228.3L375.3,229.5L368.0,228.5L364.6,230.6L362.3,228.1L359.3,228.2L357.3,223.1L352.6,224.8L347.7,229.9L344.9,223.2L339.1,217.6L339.7,214.0L337.8,213.3L339.2,211.7L335.1,210.4L334.8,208.0L325.3,202.5L324.8,193.8L327.0,189.1L324.6,186.4L324.6,182.0L329.2,178.7L324.7,173.0L319.6,173.8L312.9,171.5L308.8,171.8L308.4,173.7L307.0,173.6L304.3,169.8L301.4,175.5L294.8,178.9L286.7,178.0L284.5,175.4L284.6,173.8L290.3,171.9L292.4,166.9L296.1,164.3L302.9,162.7L308.1,155.9L308.0,143.0L304.8,139.6L300.7,139.1L306.5,131.1L303.8,129.4L303.8,124.4L300.1,123.4L300.4,121.3L285.2,112.2L284.5,108.2L281.5,106.1L282.2,104.5L278.1,96.7L278.3,94.3L269.3,82.0L268.7,77.9L259.8,78.9L269.6,74.9L276.0,65.1L274.0,57.4L282.0,58.2L283.2,55.7L286.6,54.2L287.6,50.2L289.7,49.1L289.0,47.7L299.1,38.6L296.8,32.7L298.7,29.9L303.5,27.9L307.7,27.4L308.7,30.8L311.3,31.4L321.8,28.1L323.5,29.9L327.5,29.4L335.2,33.1L345.3,25.7L367.8,25.1L373.2,29.4L371.1,34.6L372.8,36.2L371.1,42.0L373.4,42.9L376.1,48.3L372.5,53.0L374.5,57.8L384.1,57.6L387.4,52.5L390.2,53.2L390.7,51.8L393.9,52.3L396.7,55.5L400.2,55.6L402.0,53.9L404.7,55.5L408.6,52.9L410.7,54.0L412.4,52.9L410.3,47.6L412.3,44.1L417.3,42.2L417.6,38.8L416.4,38.2L419.1,31.2L418.7,27.3L424.1,21.5L441.2,20.5L442.8,12.3L447.8,10.5L449.5,5.7L455.1,4.0L456.2,0.0Z",
  BB: "M475.9,177.6L487.9,178.2L495.8,183.9L499.4,182.5L507.9,189.5L518.3,184.6L520.5,184.3L524.2,187.6L531.7,186.1L544.1,186.8L548.4,184.5L551.8,187.6L580.0,191.5L583.1,186.6L597.5,194.1L599.1,195.5L595.7,196.5L594.5,203.3L586.8,210.2L586.3,217.6L588.6,222.1L584.2,226.4L584.2,234.1L585.7,236.2L589.0,235.7L598.4,243.4L605.2,252.6L603.6,256.3L605.4,261.8L604.1,265.0L608.5,266.6L610.6,265.7L614.5,268.3L610.2,284.6L605.2,289.4L605.9,299.8L612.0,301.6L611.8,304.6L616.9,304.6L618.7,302.8L621.5,305.9L624.5,304.7L625.7,302.2L628.7,303.0L631.9,301.4L634.4,307.0L631.2,308.0L625.0,315.9L625.8,319.8L622.6,325.4L623.9,329.8L619.4,333.7L616.2,342.9L611.3,346.8L609.2,354.4L606.1,354.4L606.7,356.3L602.1,357.3L593.4,352.6L592.3,357.1L588.0,357.3L588.4,360.2L575.7,359.4L576.8,362.4L575.8,367.0L568.3,374.5L564.6,375.9L566.2,378.0L565.2,379.0L563.1,379.4L561.5,382.2L557.5,379.6L550.9,382.0L550.4,383.7L548.0,382.7L546.1,386.4L544.0,386.5L541.5,391.9L534.7,393.5L537.5,387.7L534.8,382.6L528.0,381.8L527.2,379.4L525.4,383.5L521.2,381.9L518.7,383.7L518.7,385.8L516.6,386.0L514.5,382.9L518.5,378.0L517.8,375.6L515.3,375.7L510.7,370.0L508.1,369.3L506.2,369.6L503.8,373.3L498.6,372.7L495.7,368.5L495.0,363.6L490.4,363.3L488.0,360.4L478.7,369.4L469.7,372.9L470.3,376.1L466.0,380.8L467.5,385.5L463.9,389.6L464.1,397.7L459.7,402.2L459.5,404.4L456.8,402.3L457.2,399.7L455.2,399.8L452.1,403.1L447.5,404.8L445.4,402.2L442.5,403.8L440.0,402.6L430.5,403.2L426.2,407.0L422.3,407.9L420.2,412.3L414.9,409.5L409.6,410.3L401.6,406.9L396.6,409.2L392.8,407.3L388.2,411.4L386.0,409.0L383.8,409.5L381.6,407.8L380.1,403.8L389.6,390.8L386.6,384.1L388.3,383.0L388.1,379.6L390.3,377.9L388.8,376.8L390.6,375.2L386.7,372.5L383.6,375.6L370.8,378.3L369.0,380.8L367.2,379.7L366.1,384.6L358.3,383.7L356.8,385.2L355.6,382.4L348.7,379.6L346.8,382.6L344.6,383.0L342.8,377.0L348.6,372.0L344.6,365.8L346.7,364.3L344.1,361.7L345.6,358.2L350.2,355.7L350.0,351.1L352.2,345.7L351.0,341.8L348.8,341.7L347.3,338.6L344.9,328.6L340.3,326.9L334.0,316.7L331.1,316.4L325.3,322.6L323.7,327.5L322.0,327.7L321.4,332.7L317.4,335.3L317.4,333.8L314.3,333.0L310.4,335.7L303.6,334.5L297.1,344.5L296.6,341.3L298.0,340.1L295.0,338.6L297.1,338.8L298.6,334.0L302.4,331.7L304.1,327.2L303.1,319.7L301.3,316.0L297.6,316.2L298.7,311.3L296.9,310.4L296.4,307.1L294.4,307.3L298.9,300.5L296.2,301.2L297.4,293.5L292.8,291.8L290.1,292.6L290.0,294.5L287.5,294.4L290.8,288.8L293.9,286.7L291.2,287.5L287.0,281.5L288.5,281.3L290.4,276.3L291.8,277.9L296.1,278.2L302.5,276.7L304.3,273.9L307.8,274.5L308.6,269.8L318.1,257.4L328.5,261.0L328.1,255.2L332.9,251.6L335.2,243.7L342.4,241.4L347.5,229.9L352.6,224.8L357.3,223.1L359.3,228.2L362.3,228.1L364.6,230.6L368.0,228.5L377.7,228.6L380.8,218.3L376.4,213.5L378.5,209.1L377.0,202.6L380.9,200.4L382.0,195.2L384.6,193.4L392.1,195.4L403.1,193.4L404.8,194.5L406.5,192.8L409.9,193.9L420.6,190.0L424.3,192.9L424.5,197.9L422.1,200.3L429.6,199.3L432.6,197.5L435.7,190.2L439.1,189.3L445.1,181.8L456.2,181.1L463.6,177.2L468.2,178.4L472.2,176.2L475.9,177.6Z",
  PO: "M779.4,43.0L786.6,43.0L792.1,47.9L796.8,47.6L802.6,53.3L809.5,52.9L813.3,48.7L817.1,51.8L819.8,47.1L823.2,47.8L825.3,45.6L829.5,47.6L836.9,44.0L842.6,52.5L845.7,53.7L848.9,51.6L852.6,53.2L853.7,57.0L860.0,60.9L862.6,68.1L864.5,68.3L864.3,65.1L867.0,61.2L873.0,58.7L876.6,64.7L879.6,63.5L884.5,69.8L887.0,68.6L889.8,70.8L894.5,70.0L898.4,80.2L907.3,88.6L906.6,92.8L908.6,94.3L907.4,103.5L912.1,106.3L926.4,109.3L926.3,111.3L934.1,116.1L938.1,113.2L940.1,113.5L942.5,117.7L940.7,121.9L944.7,121.8L956.7,126.4L959.7,123.5L965.2,123.4L969.7,131.1L975.0,136.0L980.9,134.8L988.0,139.6L995.4,137.2L1000.0,139.0L997.8,141.2L997.4,154.3L995.2,156.6L996.5,160.5L992.2,163.1L988.6,162.4L984.6,164.6L984.3,168.5L975.4,180.9L976.6,183.6L974.8,192.8L970.2,194.7L968.1,198.7L966.9,196.6L960.8,196.9L958.3,195.3L946.2,197.7L941.3,181.4L938.9,180.8L934.2,181.0L928.6,190.4L923.5,191.6L924.3,203.3L913.8,202.7L906.5,204.9L899.8,204.6L899.8,202.6L892.0,201.4L891.9,196.9L886.3,193.7L878.3,190.7L874.6,190.3L872.2,192.2L870.1,188.9L866.4,188.3L864.2,189.8L863.5,193.6L865.3,198.1L864.0,199.2L866.1,205.5L865.1,209.3L867.6,213.5L866.8,217.6L861.2,218.4L858.8,221.8L854.2,220.2L853.2,223.3L849.4,224.9L844.6,224.2L841.9,220.4L834.3,222.1L830.6,219.7L828.7,220.3L825.4,216.7L821.3,216.7L818.6,211.8L818.3,207.2L813.2,202.8L814.4,198.7L811.3,196.9L811.3,193.4L807.6,193.8L805.4,196.2L803.7,196.2L803.7,194.8L801.9,195.8L800.2,190.2L799.1,196.1L795.7,192.6L792.7,193.5L793.8,199.8L790.9,205.0L782.1,205.3L779.5,207.5L781.6,211.1L775.8,212.3L769.8,207.5L769.4,201.4L773.4,199.3L772.1,195.6L771.0,197.2L768.1,196.9L766.3,194.3L765.9,196.3L761.2,192.8L758.5,196.4L754.0,189.9L750.8,188.5L744.1,190.3L737.0,187.2L731.2,187.6L729.2,182.4L725.2,179.2L724.4,173.1L719.0,174.0L718.1,176.1L712.9,171.8L709.3,172.0L705.5,168.8L699.3,170.2L700.7,168.9L696.0,168.8L695.1,167.4L698.9,164.8L694.6,165.7L689.1,162.4L687.3,164.4L686.6,161.4L687.0,168.7L688.8,169.8L686.1,171.2L683.8,168.2L680.5,170.9L676.5,167.0L670.7,169.3L670.2,173.4L662.7,174.9L660.2,167.8L653.0,170.0L650.9,166.5L644.2,162.4L644.9,157.2L642.6,157.4L640.7,161.7L636.4,161.5L641.3,163.6L637.8,166.3L636.7,165.1L637.9,170.8L635.6,169.1L635.8,166.1L633.9,163.8L631.9,165.2L627.2,161.3L624.6,165.5L622.9,166.1L622.7,164.3L616.5,167.2L604.9,176.8L604.5,179.5L608.8,179.2L612.1,182.4L609.0,187.8L605.9,186.7L603.9,188.9L602.8,195.1L600.7,196.3L583.1,186.6L580.0,191.5L551.1,186.7L558.5,184.9L563.0,180.1L558.1,179.7L555.9,175.4L556.5,171.1L546.1,159.7L547.0,157.9L549.3,159.0L555.1,158.0L554.7,152.7L557.1,147.5L555.8,143.5L557.7,141.7L559.0,133.6L550.5,134.4L550.8,133.3L548.1,133.6L547.3,131.1L544.1,133.1L543.5,128.5L546.1,125.5L549.1,125.1L552.5,119.2L545.1,124.2L539.7,124.7L537.3,130.2L534.1,127.5L539.0,121.2L537.6,114.2L535.0,114.0L535.0,109.3L532.2,108.3L535.4,105.9L535.6,101.2L540.6,99.7L549.2,101.0L553.9,104.1L556.0,109.0L564.5,114.5L567.8,114.8L567.1,110.4L570.2,103.4L570.0,96.1L574.3,90.6L577.8,78.3L578.9,78.1L579.9,82.2L583.1,79.2L582.2,75.6L584.6,75.6L586.1,72.1L591.0,69.3L592.9,70.7L596.6,69.3L599.4,70.8L600.0,69.4L603.6,69.3L607.2,71.4L608.9,69.3L608.4,62.5L610.2,58.8L607.8,59.5L609.1,55.7L615.6,57.0L618.0,54.5L619.1,58.9L621.0,59.0L623.8,58.2L625.2,55.0L628.2,57.2L627.8,51.9L630.3,53.4L630.2,52.2L634.8,52.4L640.5,55.6L641.4,58.3L652.8,62.8L659.5,56.0L659.7,51.8L666.0,56.3L673.1,51.3L678.5,51.3L682.3,52.8L681.9,55.5L684.7,56.5L682.8,58.5L685.3,60.8L684.8,63.6L689.5,63.3L688.8,66.7L693.7,67.4L693.0,68.8L691.7,67.3L691.7,71.7L693.7,70.3L696.5,73.9L698.7,73.9L701.5,70.5L703.4,70.4L706.4,74.2L704.7,77.7L710.4,77.0L710.0,78.7L713.6,83.9L721.6,80.3L724.5,81.2L725.9,79.6L725.0,75.4L728.3,73.7L728.8,70.4L734.3,65.8L738.4,65.6L740.0,67.3L743.3,65.8L745.0,62.8L736.4,55.4L735.4,51.4L743.7,48.7L746.7,50.2L748.5,46.9L753.4,49.4L758.3,55.9L763.2,55.9L766.5,52.0L767.5,46.9L768.9,47.5L773.3,44.1L774.3,40.7L779.4,43.0Z",
  KE: "M643.8,157.5L645.1,157.3L645.6,159.2L644.2,162.4L646.4,164.6L650.9,166.5L653.0,170.0L660.2,167.8L662.7,174.9L670.2,173.4L670.7,169.3L676.5,167.0L680.5,170.9L683.8,168.2L686.1,171.2L688.8,169.8L687.0,168.7L686.6,161.4L687.3,164.4L689.1,162.4L694.6,165.7L698.9,164.8L695.1,167.4L696.0,168.8L700.7,168.9L699.3,170.2L705.5,168.8L709.3,172.0L712.9,171.8L718.1,176.1L719.0,174.0L724.4,173.1L725.2,179.2L729.2,182.4L731.2,187.6L737.0,187.2L744.1,190.3L750.8,188.5L754.0,189.9L758.5,196.4L761.2,192.8L765.9,196.3L766.3,194.3L768.1,196.9L771.0,197.2L772.1,195.6L773.4,199.3L769.4,201.4L769.8,207.5L775.8,212.3L781.6,211.1L779.5,207.5L782.1,205.3L790.9,205.0L793.8,199.8L792.7,193.5L795.7,192.6L799.1,196.1L800.2,190.2L801.9,195.8L803.7,194.8L803.7,196.2L805.4,196.2L807.6,193.8L811.3,193.4L811.3,196.9L814.4,198.7L813.2,202.8L818.3,207.2L818.6,211.8L821.3,216.7L825.4,216.7L828.7,220.3L830.6,219.7L834.3,222.1L841.9,220.4L846.3,225.0L852.5,223.9L854.2,220.2L858.8,221.8L861.2,218.4L866.8,217.6L867.6,213.5L865.1,209.3L866.1,205.5L864.0,199.2L865.3,198.1L863.5,193.6L864.2,189.8L866.4,188.3L870.1,188.9L872.2,192.2L874.6,190.3L878.3,190.7L886.3,193.7L891.9,196.9L892.0,201.4L899.8,202.6L899.8,204.6L906.5,204.9L913.8,202.7L924.3,203.3L923.5,191.6L928.6,190.4L934.2,181.0L936.1,180.7L941.3,181.4L946.2,197.7L957.7,195.3L960.8,196.9L966.9,196.6L968.9,215.1L961.6,224.1L961.1,228.2L964.5,231.0L964.4,233.6L962.5,236.2L960.6,245.8L954.1,247.8L945.0,255.5L943.3,260.7L934.3,265.4L931.2,271.3L925.3,312.2L926.1,319.5L928.4,321.2L924.1,323.2L925.0,326.0L917.6,326.5L916.4,328.4L914.6,324.2L910.8,326.8L905.0,322.8L900.3,326.8L892.2,326.6L888.5,328.5L888.8,331.0L886.0,328.9L884.1,330.1L883.8,328.7L883.8,330.6L881.1,329.7L881.1,332.5L880.6,330.7L879.6,332.5L877.8,331.4L877.2,332.6L875.8,329.7L872.8,330.6L872.3,338.3L869.5,338.6L866.1,336.0L860.4,337.0L853.0,334.0L851.0,332.0L851.4,329.7L849.9,329.8L849.4,326.1L842.8,322.9L842.6,316.1L835.0,302.3L834.0,291.9L830.0,291.0L827.7,293.2L824.8,291.4L821.4,292.2L818.5,288.4L816.5,280.9L805.5,274.6L803.6,271.9L800.6,273.6L799.5,278.7L796.7,277.5L793.1,279.0L782.6,278.2L782.0,279.8L783.9,280.2L781.5,281.0L782.9,281.7L782.3,284.0L780.9,283.8L782.0,285.6L780.2,288.5L773.8,287.7L768.5,283.9L767.6,285.4L765.4,284.5L758.2,289.6L755.0,288.7L750.2,295.6L747.4,296.8L743.3,294.3L744.0,291.6L742.5,289.7L738.4,287.6L736.2,288.5L729.5,285.9L723.7,289.7L722.7,287.9L719.2,288.7L719.2,285.4L716.6,285.3L716.7,283.1L715.5,284.3L713.3,278.7L703.9,280.7L701.5,276.7L699.8,276.8L700.8,272.8L698.6,274.8L698.3,272.5L680.4,275.9L679.4,277.4L676.8,275.8L671.0,278.7L666.5,278.2L664.8,280.7L661.2,281.0L654.7,284.9L647.8,282.7L646.2,287.0L643.0,284.5L640.8,285.3L641.0,297.2L638.8,297.7L635.0,303.3L633.4,303.9L631.9,301.4L628.7,303.0L625.7,302.2L624.5,304.7L621.5,305.9L618.7,302.8L616.9,304.6L611.8,304.6L612.0,301.6L605.9,299.8L606.4,295.7L604.4,293.2L605.2,289.4L610.2,284.6L614.5,268.3L610.6,265.7L608.5,266.6L604.1,265.0L605.4,261.8L603.6,256.3L605.2,252.6L598.4,243.4L589.0,235.7L585.7,236.2L584.2,234.1L584.2,226.4L588.6,222.1L586.3,217.6L586.8,210.2L594.5,203.3L595.7,196.5L602.8,195.1L603.9,188.9L605.9,186.7L609.0,187.8L611.6,184.5L610.6,179.9L606.7,180.4L604.1,178.9L609.3,171.9L620.0,165.3L622.7,164.3L622.9,166.1L624.6,165.5L627.2,161.3L631.9,165.2L633.9,163.8L635.8,166.1L635.6,169.1L637.9,170.8L636.7,165.1L637.8,166.3L641.3,163.6L636.4,161.5L640.7,161.7L643.8,157.5Z",
};

  var MAP_LABELS = {
    BA: { x: 62,  y: 330 }, TT: { x: 125, y: 330 }, TN: { x: 240, y: 200 },
    NR: { x: 290, y: 375 }, ZA: { x: 420, y: 125 }, BB: { x: 470, y: 310 },
    PO: { x: 735, y: 135 }, KE: { x: 770, y: 275 }
  };

  var OBSADENOST = 12;
  var RENT_G = 0.03;
  var COST_G = 0.02;

  var KONZULTACIA_URL = "https://konzultacia.jsmentor.sk/";
  var BONUSY_CTA_LABEL = "Rezervovať konzultáciu s Ivanom";

  var W = 1100;
  var HC = 400;
  var P = { l: 130, r: 130, t: 18, b: 60 };

  var kraj = "ZA";
  var typ = "2i";
  var costM = 160;
  var costY = 300;
  var customPrice = 225000;
  var customRent = 700;
  var grow = defaultGrow(KRAJE.ZA.hist);
  var years = 20;
  var useMort = true;
  var equity = 20;
  var mortRate = 3.8;
  var hoverYear = null;
  var tooltipPos = { x: 0, y: 0, flip: false, containerW: 0 };
  var root = null;
  var chartWrap = null;

  function defaultGrow(hist) {
    return Math.min(12, Math.round((hist - 1) * 2) / 2);
  }

  function fmt(n) {
    return new Intl.NumberFormat("sk-SK", { maximumFractionDigits: 0 }).format(Math.round(n)) + " €";
  }
  function pctFmt(n, decimals) {
    if (decimals == null) decimals = 1;
    return n.toLocaleString("sk-SK", { maximumFractionDigits: decimals }) + " %";
  }
  function autoPrice(k, t) {
    var K = KRAJE[k];
    var T = TYPY[t];
    return Math.round((K.m2 * T.pk * T.m) / 1000) * 1000;
  }
  function autoRent(k, t) {
    var K = KRAJE[k];
    var T = TYPY[t];
    return Math.round((K.rent2i * T.rk) / 10) * 10;
  }
  function mortgageFn(V0, eqPct, rate, termY, t) {
    var loan = V0 * (1 - eqPct / 100);
    if (loan <= 0) return { balance: 0, payment: 0 };
    var r = rate / 100 / 12;
    var n = termY * 12;
    var m = Math.min(t * 12, n);
    var pay = (loan * r) / (1 - Math.pow(1 + r, -n));
    var bal = m >= n ? 0 : loan * Math.pow(1 + r, m) - (pay * (Math.pow(1 + r, m) - 1)) / r;
    return { balance: Math.max(0, bal), payment: pay };
  }
  function cumCF(R0, CM, CY, Y, useM, payment, termY) {
    var najmy = 0;
    var naklady = 0;
    var splatky = 0;
    for (var t = 0; t < Y; t++) {
      najmy += R0 * Math.pow(1 + RENT_G, t) * OBSADENOST;
      naklady += (CM * 12 + CY) * Math.pow(1 + COST_G, t);
      if (useM && t < termY) splatky += payment * 12;
    }
    return { najmy: najmy, naklady: naklady, splatky: splatky, net: najmy - naklady - splatky };
  }
  function colorFor(p) {
    var t = Math.min(1, Math.max(0, (p - 2500) / (4600 - 2500)));
    var a = [38, 53, 43];
    var b = [91, 199, 138];
    return "rgb(" + a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }).join(",") + ")";
  }

  function currentPrice() {
    return typ === "X" ? customPrice : autoPrice(kraj, typ);
  }
  function currentRent() {
    return typ === "X" ? customRent : autoRent(kraj, typ);
  }

  function compute() {
    var K = KRAJE[kraj];
    var price = currentPrice();
    var rent = currentRent();
    var g = grow / 100;
    var Y = years;
    var mort0 = useMort ? mortgageFn(price, equity, mortRate, 30, 0) : { balance: 0, payment: 0 };
    var mortY = useMort ? mortgageFn(price, equity, mortRate, 30, Y) : { balance: 0, payment: 0 };
    var VT = price * Math.pow(1 + g, Y);
    var CF = cumCF(rent, costM, costY, Y, useMort, mort0.payment, 30);
    var wealth = VT - mortY.balance + CF.net;
    var vklad = useMort ? (price * equity) / 100 : price;
    var cfNow = (rent * OBSADENOST) / 12 - (costM + costY / 12) - (useMort ? mort0.payment : 0);
    var yieldPct = price > 0 ? ((rent * OBSADENOST - costM * 12 - costY) / price) * 100 : 0;
    var chartData = [];
    for (var t = 0; t <= Y; t++) {
      chartData.push({
        t: t,
        V: price * Math.pow(1 + g, t),
        H: useMort ? mortgageFn(price, equity, mortRate, 30, t).balance : 0,
        R: rent * Math.pow(1 + RENT_G, t) * 12,
        C: (costM * 12 + costY) * Math.pow(1 + COST_G, t)
      });
    }
    var maxV = Math.max.apply(null, chartData.map(function (d) { return d.V; })) * 1.06;
    var maxR = Math.max.apply(null, chartData.map(function (d) { return Math.max(d.R, d.C); })) * 1.15;
    return {
      K: K, price: price, rent: rent, g: g, Y: Y, mort0: mort0, mortY: mortY,
      VT: VT, CF: CF, wealth: wealth, vklad: vklad, cfNow: cfNow, yieldPct: yieldPct,
      chartData: chartData, maxV: maxV, maxR: maxR
    };
  }

  function xFn(t, Y) {
    return P.l + ((W - P.l - P.r) * t) / Y;
  }
  function yLFn(v, maxV) {
    return HC - P.b - ((HC - P.t - P.b) * Math.max(0, v)) / maxV;
  }
  function yRFn(v, maxR) {
    return HC - P.b - ((HC - P.t - P.b) * Math.max(0, v)) / maxR;
  }
  function makePath(pts) {
    return pts.map(function (xy, i) {
      return (i === 0 ? "M" : "L") + xy[0].toFixed(1) + "," + xy[1].toFixed(1);
    }).join("");
  }

  function pill(text) {
    return '<span class="inline-block rounded-full bg-primary px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-white mb-6">' + text + "</span>";
  }

  function handleKrajClick(k) {
    kraj = k;
    grow = defaultGrow(KRAJE[k].hist);
    if (typ !== "X") costM = TYPY[typ].cm;
    hoverYear = null;
    update();
  }
  function handleTypClick(t) {
    typ = t;
    if (t !== "X") costM = TYPY[t].cm;
    hoverYear = null;
    update();
  }

  function setIfUnfocused(el, value) {
    if (!el) return;
    if (document.activeElement === el) return;
    if (String(el.value) !== String(value)) el.value = value;
  }

  function tableRowsHtml(data) {
    var tblTyp = typ === "X" ? "2i" : typ;
    var Y = data.Y;
    var rows = Object.keys(KRAJE).map(function (k) {
      return { k: k, kd: KRAJE[k] };
    }).sort(function (a, b) {
      return b.kd.m2 - a.kd.m2;
    });
    return rows.map(function (row) {
      var k = row.k;
      var kd = row.kd;
      var p = autoPrice(k, tblTyp);
      var r = autoRent(k, tblTyp);
      var proj = p * Math.pow(1 + kd.hist / 100, Y);
      var yld = ((r * OBSADENOST - costM * 12 - costY) / p) * 100;
      var cls = "cursor-pointer transition-colors hover:bg-primary/[0.08]" + (k === kraj ? " bg-primary/[0.16]" : "");
      return (
        '<tr data-iby-row="' + k + '" class="' + cls + '">' +
          '<td class="py-[13px] px-[14px] font-extrabold border-b border-border text-foreground">' + kd.name + "</td>" +
          '<td class="py-[13px] px-[14px] text-right border-b border-border font-semibold">' + fmt(p) + "</td>" +
          '<td class="py-[13px] px-[14px] text-right border-b border-border font-semibold">' + fmt(r) + "</td>" +
          '<td class="py-[13px] px-[14px] text-right border-b border-border font-extrabold text-primary">' + pctFmt(yld) + "</td>" +
          '<td class="py-[13px] px-[14px] text-right border-b border-border font-extrabold text-primary">' + pctFmt(kd.hist) + "</td>" +
          '<td class="py-[13px] px-[14px] text-right border-b border-border font-black text-foreground"><strong>' + fmt(proj) + "</strong></td>" +
        "</tr>"
      );
    }).join("");
  }

  function resCard(label, value, color) {
    var valCls = color === "green" ? "text-[#5BC78A]" : color === "red" ? "text-[#E08573]" : "text-[#FFF9F5]";
    return (
      '<div class="bg-[#1A1B18] border border-[rgba(245,237,224,.1)] rounded-xl p-[18px_20px]">' +
        '<div class="text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-[rgba(245,237,224,.55)] mb-1">' + label + "</div>" +
        '<div class="text-[23px] font-black ' + valCls + '">' + value + "</div>" +
      "</div>"
    );
  }

  function chartSvg(data) {
    var Y = data.Y;
    var maxV = data.maxV;
    var maxR = data.maxR;
    var chartData = data.chartData;
    var vPath = makePath(chartData.map(function (d) { return [xFn(d.t, Y), yLFn(d.V, maxV)]; }));
    var hPath = useMort ? makePath(chartData.map(function (d) { return [xFn(d.t, Y), yLFn(d.H, maxV)]; })) : "";
    var rPath = makePath(chartData.map(function (d) { return [xFn(d.t, Y), yRFn(d.R, maxR)]; }));
    var cPath = makePath(chartData.map(function (d) { return [xFn(d.t, Y), yRFn(d.C, maxR)]; }));
    var grid = "";
    for (var i = 0; i < 5; i++) {
      var vl = (maxV * i) / 4;
      var vr = (maxR * i) / 4;
      var yy = yLFn(vl, maxV);
      grid +=
        "<g>" +
          '<line x1="' + P.l + '" x2="' + (W - P.r) + '" y1="' + yy + '" y2="' + yy + '" stroke="rgba(245,237,224,.08)" stroke-width="1" />' +
          '<text x="' + (P.l - 14) + '" y="' + (yy + 6) + '" text-anchor="end" font-size="32" font-weight="700" fill="rgba(245,237,224,.5)" font-family="inherit">' + Math.round(vl / 1000) + "k €</text>" +
          '<text x="' + (W - P.r + 14) + '" y="' + (yy + 6) + '" text-anchor="start" font-size="32" font-weight="700" fill="#D9A441" font-family="inherit">' + (vr / 1000).toLocaleString("sk-SK", { maximumFractionDigits: 1 }) + "k €/r</text>" +
        "</g>";
    }
    var xTicks = "";
    var step = Y <= 12 ? 2 : 5;
    for (var t = 0; t <= Y; t += step) {
      xTicks +=
        '<text x="' + xFn(t, Y) + '" y="' + (HC - 10) + '" text-anchor="middle" font-size="32" font-weight="700" fill="rgba(245,237,224,.5)" font-family="inherit">' + (2026 + t) + "</text>";
    }
    var hover = "";
    var hd = hoverYear !== null ? chartData[hoverYear] : null;
    if (hd) {
      hover =
        '<line x1="' + xFn(hd.t, Y) + '" x2="' + xFn(hd.t, Y) + '" y1="' + P.t + '" y2="' + (HC - P.b) + '" stroke="rgba(245,237,224,.35)" stroke-width="1.5" />' +
        '<circle cx="' + xFn(hd.t, Y) + '" cy="' + yLFn(hd.V, maxV) + '" r="6" fill="#5BC78A" stroke="#14150f" stroke-width="2.5" />' +
        (useMort ? '<circle cx="' + xFn(hd.t, Y) + '" cy="' + yLFn(hd.H, maxV) + '" r="5" fill="#F5EDE0" stroke="#14150f" stroke-width="2.5" />' : "") +
        '<circle cx="' + xFn(hd.t, Y) + '" cy="' + yRFn(hd.R, maxR) + '" r="5" fill="#D9A441" stroke="#14150f" stroke-width="2.5" />' +
        '<circle cx="' + xFn(hd.t, Y) + '" cy="' + yRFn(hd.C, maxR) + '" r="5" fill="#E08573" stroke="#14150f" stroke-width="2.5" />';
    }
    return (
      '<svg viewBox="0 0 ' + W + " " + HC + '" class="w-full block" style="min-height:260px;touch-action:none" data-iby-chart-svg>' +
        grid + xTicks +
        '<path d="' + vPath + '" fill="none" stroke="#5BC78A" stroke-width="3" stroke-linejoin="round" />' +
        (useMort ? '<path d="' + hPath + '" fill="none" stroke="rgba(245,237,244,.45)" stroke-width="3" stroke-linejoin="round" stroke-dasharray="7 7" />' : "") +
        '<path d="' + rPath + '" fill="none" stroke="#D9A441" stroke-width="2.5" stroke-linejoin="round" />' +
        '<path d="' + cPath + '" fill="none" stroke="#E08573" stroke-width="2.5" stroke-linejoin="round" stroke-dasharray="2 5" />' +
        hover +
      "</svg>"
    );
  }

  function tooltipHtml(data) {
    var hd = hoverYear !== null ? data.chartData[hoverYear] : null;
    if (!hd) return "";
    var left = Math.min(
      Math.max(4, tooltipPos.flip ? tooltipPos.x - 234 : tooltipPos.x + 16),
      tooltipPos.containerW > 0 ? tooltipPos.containerW - 238 : tooltipPos.x + 16
    );
    var top = Math.max(6, tooltipPos.y - 30);
    var rows = [
      { c: "#5BC78A", l: "Hodnota bytu", v: fmt(hd.V) }
    ];
    if (useMort) rows.push({ c: "#F5EDE0", l: "Zostatok hypotéky", v: fmt(hd.H) });
    rows.push({ c: "#D9A441", l: "Nájom za rok", v: fmt(hd.R) });
    rows.push({ c: "#E08573", l: "Náklady za rok", v: fmt(hd.C) });
    var body = rows.map(function (r) {
      return (
        '<div class="flex items-center gap-[7px] py-[2px]">' +
          '<span class="w-[9px] h-[9px] rounded-sm flex-shrink-0" style="background:' + r.c + '"></span>' +
          "<span>" + r.l + "</span>" +
          '<strong class="ml-auto pl-[14px] tabular-nums">' + r.v + "</strong>" +
        "</div>"
      );
    }).join("");
    return (
      '<div class="iby-tooltip" style="left:' + left + "px;top:" + top + 'px">' +
        '<div class="text-[10px] tracking-[0.12em] uppercase opacity-60 mb-1.5">rok ' + (2026 + hd.t) + " · +" + hd.t + " r.</div>" +
        body +
      "</div>"
    );
  }

  function mapSvgHtml() {
    var paths = Object.keys(MAP_PATHS).map(function (k) {
      return '<path d="' + MAP_PATHS[k] + '" class="iby-kraj' + (k === kraj ? " active" : "") + '" fill="' + colorFor(KRAJE[k].m2) + '" data-iby-kraj="' + k + '"></path>';
    }).join("");
    var labels = Object.keys(MAP_LABELS).map(function (k) {
      var pos = MAP_LABELS[k];
      return (
        "<g>" +
          '<text font-family="inherit" font-size="26" font-weight="900" fill="#F5EDE0" text-anchor="middle" pointer-events="none" x="' + pos.x + '" y="' + pos.y + '">' + k + "</text>" +
          '<text font-family="inherit" font-size="17" font-weight="600" fill="rgba(245,237,224,.8)" text-anchor="middle" pointer-events="none" x="' + pos.x + '" y="' + (pos.y + 26) + '">' + KRAJE[k].m2.toLocaleString("sk-SK") + " €/m²</text>" +
        "</g>"
      );
    }).join("");
    return (
      '<svg viewBox="0 0 1000 498" class="w-full h-auto block" role="img" aria-label="Mapa krajov Slovenska">' +
        paths + labels +
      "</svg>"
    );
  }

  function buildShell() {
    var typChips = ["G", "1i", "2i", "3i", "4i"].map(function (t) {
      return '<button type="button" data-iby-typ="' + t + '" class="iby-chip">' + TYPY[t].short + "</button>";
    }).join("") +
      '<button type="button" data-iby-typ="X" class="iby-chip iby-chip-dashed">✏️ Vlastné čísla</button>';

    root.innerHTML =
      '<div class="text-center mb-10 md:mb-[50px] max-w-[760px] mx-auto px-5">' +
        pill("Interaktívna mapa") +
        '<h1 class="[font-family:var(--font-serif)] font-black text-[clamp(1.875rem,6vw,3.125rem)] leading-[1.15] tracking-[-0.015em] text-foreground mb-3">' +
          'Koľko ti zarobí byt<br />za <span class="text-primary" data-iby-years-hero></span>?' +
        "</h1>" +
        '<p class="text-[16.5px] text-muted-foreground font-[500] leading-relaxed max-w-[580px] mx-auto mt-3">' +
          "Vyber krajské mesto a typ bytu. Ceny kalibrované na aktuálne ponuky (nehnutelnosti.sk), nájmy z Deloitte Rent Index — žiadne realitkárske rozprávky." +
        "</p>" +
        '<div class="grid grid-cols-3 gap-2 mt-[30px] sm:gap-3">' +
          '<div class="bg-card border border-border rounded-[14px] px-3 py-3 sm:px-[22px] sm:py-[14px]"><strong class="block text-[14px] sm:text-[18px] font-black text-foreground leading-tight">NBS + trh</strong><span class="text-[10px] sm:text-[11px] font-semibold text-muted-foreground leading-tight">ceny · Q1 2026</span></div>' +
          '<div class="bg-card border border-border rounded-[14px] px-3 py-3 sm:px-[22px] sm:py-[14px]"><strong class="block text-[14px] sm:text-[18px] font-black text-foreground leading-tight">Deloitte</strong><span class="text-[10px] sm:text-[11px] font-semibold text-muted-foreground leading-tight">nájmy · Q4 2025</span></div>' +
          '<div class="bg-card border border-border rounded-[14px] px-3 py-3 sm:px-[22px] sm:py-[14px]"><strong class="block text-[14px] sm:text-[18px] font-black text-foreground leading-tight">8 miest</strong><span class="text-[10px] sm:text-[11px] font-semibold text-muted-foreground leading-tight">celé Slovensko</span></div>' +
        "</div>" +
      "</div>" +

      '<section class="rounded-2xl mb-5 overflow-hidden" style="background:#111210;color:#F5EDE0">' +
        '<div class="px-2 py-[30px] md:px-8 md:py-[70px]">' +
          '<div class="text-center mb-8 max-w-[980px] mx-auto">' +
            pill("Krok 1") +
            '<h2 class="[font-family:var(--font-serif)] font-black text-[clamp(1.5rem,4.4vw,2.25rem)] leading-[1.15] tracking-[-0.015em] mb-3">Klikni na <em class="not-italic text-[#5BC78A]">svoj kraj</em></h2>' +
          "</div>" +
          '<div class="max-w-[980px] mx-auto">' +
            '<div class="bg-[#1A1B18] border border-[rgba(245,237,224,.14)] rounded-[14px] p-[10px_4px_10px] md:p-[26px_20px_18px] mt-[34px]">' +
              '<div data-iby-map></div>' +
              '<div class="flex items-center justify-center gap-2.5 mt-[14px] text-[11.5px] font-semibold text-[#B8B2A4]">' +
                "<span>lacnejší m²</span>" +
                '<div class="w-[170px] h-2 rounded-full" style="background:linear-gradient(90deg,#26352B,#2B6B4A,#5BC78A)"></div>' +
                "<span>drahší m²</span>" +
              "</div>" +
              '<p class="text-center mt-[10px] text-[11.5px] text-[#B8B2A4] font-semibold">Ceny = priemer krajského mesta (to, čo reálne vidíš v ponukách), nie priemer celého kraja.</p>' +
            "</div>" +
          "</div>" +
        "</div>" +
      "</section>" +

      '<section class="bg-card border border-border rounded-2xl px-5 py-[70px] md:px-8 mb-5">' +
        '<div class="max-w-[760px] mx-auto text-center">' +
          pill("Krok 2") +
          '<h2 class="[font-family:var(--font-serif)] font-black text-[clamp(1.5rem,4.4vw,2.25rem)] leading-[1.15] tracking-[-0.015em] mb-3">Aký byt riešiš? 🏠</h2>' +
          '<p class="text-[16.5px] text-muted-foreground font-[500] max-w-[580px] mx-auto mt-[14px]">Cenu, nájom aj typické náklady doplním automaticky pre <strong class="text-foreground" data-iby-kraj-label></strong>. Všetko si vieš prepísať.</p>' +
          '<div class="flex flex-wrap justify-center gap-2.5 mt-[30px]">' + typChips + "</div>" +
          '<div data-iby-auto-cards class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6"></div>' +
          '<div data-iby-custom-cards class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 text-left" style="display:none">' +
            '<div class="bg-background border border-border rounded-[14px] p-[22px]">' +
              '<div class="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">Cena bytu (€)</div>' +
              '<input type="number" min="10000" step="1000" data-iby-custom-price class="iby-num-input text-[clamp(22px,3.4vw,30px)] font-black text-foreground mt-1 block" />' +
            "</div>" +
            '<div class="bg-background border border-border rounded-[14px] p-[22px]">' +
              '<div class="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">Nájom mesačne (€)</div>' +
              '<input type="number" min="0" step="10" data-iby-custom-rent class="iby-num-input text-[clamp(22px,3.4vw,30px)] font-black text-foreground mt-1 block" />' +
              '<div class="text-[11.5px] text-muted-foreground font-semibold mt-1.5 leading-relaxed">Koľko reálne vyberieš od nájomníka.</div>' +
            "</div>" +
          "</div>" +
          '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-left">' +
            '<div class="bg-background border border-border rounded-[14px] p-[22px]">' +
              '<div class="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">Mesačné náklady z nájmu (€)</div>' +
              '<input type="number" min="0" step="10" data-iby-costm class="iby-num-input text-[clamp(22px,3.4vw,30px)] font-black text-foreground mt-1 block" />' +
              '<div class="text-[11.5px] text-muted-foreground font-semibold mt-1.5 leading-relaxed">správa, fond opráv… <em class="not-italic text-primary font-bold">(náklady zvyšujeme priemerne o 2 % ročne)</em></div>' +
            "</div>" +
            '<div class="bg-background border border-border rounded-[14px] p-[22px]">' +
              '<div class="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">Ročné náklady (€)</div>' +
              '<input type="number" min="0" step="50" data-iby-costy class="iby-num-input text-[clamp(22px,3.4vw,30px)] font-black text-foreground mt-1 block" />' +
              '<div class="text-[11.5px] text-muted-foreground font-semibold mt-1.5 leading-relaxed">poistenie, daň z nehnuteľnosti… <em class="not-italic text-primary font-bold">(zvyšujeme priemerne o 2 % ročne)</em></div>' +
            "</div>" +
          "</div>" +
        "</div>" +
      "</section>" +

      '<section class="rounded-2xl mb-5 overflow-hidden" style="background:#111210;color:#F5EDE0">' +
        '<div class="px-2 py-[30px] md:px-8 md:py-[70px]">' +
          '<div class="max-w-[760px] mx-auto">' +
            '<div class="text-center mb-8">' +
              pill("Krok 3") +
              '<h2 class="[font-family:var(--font-serif)] font-black text-[clamp(1.5rem,4.4vw,2.25rem)] leading-[1.15] tracking-[-0.015em] mb-3">Nastav si <em class="not-italic text-[#5BC78A]">predpoklady</em></h2>' +
            "</div>" +
            '<div class="mt-[34px] text-left grid gap-[22px]">' +
              '<div>' +
                '<div class="flex justify-between items-baseline text-[11.5px] font-extrabold uppercase tracking-[0.08em] mb-2.5 text-[rgba(245,237,224,.6)]">' +
                  "<span>Rast hodnoty bytu ročne</span>" +
                  '<span class="text-[20px] font-black normal-case tracking-normal text-[#5BC78A]" data-iby-grow-val></span>' +
                "</div>" +
                '<input type="range" min="0" max="12" step="0.5" data-iby-grow class="iby-range iby-range-dark" />' +
                '<p class="text-[12px] text-[rgba(245,237,224,.55)] font-semibold mt-1.5" data-iby-grow-extra></p>' +
              "</div>" +
              '<div>' +
                '<div class="flex justify-between items-baseline text-[11.5px] font-extrabold uppercase tracking-[0.08em] mb-2.5 text-[rgba(245,237,224,.6)]">' +
                  "<span>Horizont</span>" +
                  '<span class="text-[20px] font-black normal-case tracking-normal text-[#5BC78A]" data-iby-years-val></span>' +
                "</div>" +
                '<input type="range" min="5" max="30" step="1" data-iby-years class="iby-range iby-range-dark" />' +
              "</div>" +
              '<label class="flex items-center gap-3 bg-[#1A1B18] border border-[rgba(245,237,224,.14)] rounded-xl px-[18px] py-[15px] cursor-pointer select-none">' +
                '<input type="checkbox" data-iby-mort class="accent-[#5BC78A] w-[18px] h-[18px] cursor-pointer" />' +
                '<span class="text-[14px] font-bold text-[#F5EDE0]">💪 Kúpa s hypotékou (efekt páky)</span>' +
              "</label>" +
              '<div data-iby-mort-fields class="grid gap-[22px]">' +
                '<div>' +
                  '<div class="flex justify-between items-baseline text-[11.5px] font-extrabold uppercase tracking-[0.08em] mb-2.5 text-[rgba(245,237,224,.6)]">' +
                    "<span>Vlastné zdroje</span>" +
                    '<span class="text-[20px] font-black normal-case tracking-normal text-[#5BC78A]" data-iby-equity-val></span>' +
                  "</div>" +
                  '<input type="range" min="0" max="50" step="5" data-iby-equity class="iby-range iby-range-dark" />' +
                "</div>" +
                '<div>' +
                  '<div class="flex justify-between items-baseline text-[11.5px] font-extrabold uppercase tracking-[0.08em] mb-2.5 text-[rgba(245,237,224,.6)]">' +
                    "<span>Úrok hypotéky (30 r.)</span>" +
                    '<span class="text-[20px] font-black normal-case tracking-normal text-[#5BC78A]" data-iby-rate-val></span>' +
                  "</div>" +
                  '<input type="range" min="1" max="7" step="0.1" data-iby-rate class="iby-range iby-range-dark" />' +
                "</div>" +
              "</div>" +
            "</div>" +
            '<div class="bg-[linear-gradient(150deg,rgba(43,107,74,.5),rgba(43,107,74,.12))] border border-[rgba(91,199,138,.45)] rounded-[14px] p-[30px_28px] mt-[34px]" data-iby-wealth></div>' +
            '<div class="grid grid-cols-2 gap-3 mt-3" data-iby-rescards></div>' +
            '<div class="relative mt-[24px]" data-iby-chart></div>' +
            '<div class="flex flex-wrap justify-center gap-3 md:gap-5 mt-[14px] text-[11px] md:text-[12.5px] text-[#B8B2A4] font-semibold" data-iby-legend></div>' +
          "</div>" +
        "</div>" +
      "</section>" +

      '<section class="bg-card border border-border rounded-2xl px-5 py-[70px] md:px-8 mb-5">' +
        '<div class="max-w-[980px] mx-auto text-center">' +
          pill("Porovnanie") +
          '<h2 class="[font-family:var(--font-serif)] font-black text-[clamp(1.5rem,4.4vw,2.25rem)] leading-[1.15] tracking-[-0.015em] mb-3">Ten istý byt v <em class="not-italic text-primary">každom krajskom meste</em></h2>' +
          '<p class="text-[16.5px] text-muted-foreground font-[500] mt-[14px]" data-iby-tbl-sub></p>' +
          '<div class="overflow-x-auto mt-[30px]">' +
            '<table class="w-full border-collapse text-[13.5px] min-w-[640px]">' +
              "<thead><tr>" +
                '<th class="text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-muted-foreground py-[10px] px-[14px] border-b-2 border-border text-left">Mesto</th>' +
                '<th class="text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-muted-foreground py-[10px] px-[14px] border-b-2 border-border text-right">Cena bytu</th>' +
                '<th class="text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-muted-foreground py-[10px] px-[14px] border-b-2 border-border text-right">Nájom/mes.</th>' +
                '<th class="text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-muted-foreground py-[10px] px-[14px] border-b-2 border-border text-right">Hrubý výnos</th>' +
                '<th class="text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-muted-foreground py-[10px] px-[14px] border-b-2 border-border text-right">Hist. rast</th>' +
                '<th class="text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-muted-foreground py-[10px] px-[14px] border-b-2 border-border text-right" data-iby-tbl-h-val></th>' +
              "</tr></thead>" +
              '<tbody data-iby-tbody></tbody>' +
            "</table>" +
          "</div>" +
          '<a href="' + KONZULTACIA_URL + '" target="_blank" rel="noopener noreferrer" class="btn-primary inline-block mt-[30px] text-body" data-umami-event="click_konzultacia" data-umami-event-section="investicny-byt">' + BONUSY_CTA_LABEL + "</a>" +
          '<span class="block mt-3 text-[13px] font-semibold text-muted-foreground">45 minút · zadarmo · online</span>' +
        "</div>" +
      "</section>" +

      '<div class="rounded-2xl px-5 py-[40px] md:px-8" style="background:#111210;color:#B8B2A4;border-top:1px solid rgba(245,237,224,.14)">' +
        '<p class="max-w-[760px] mx-auto text-[12.5px] md:text-[14px] leading-[1.8] text-center font-semibold">' +
          "Zdroje a metodika: Ceny bytov = priemer krajského mesta, kalibrovaný na aktuálne ponukové ceny (nehnutelnosti.sk, topreality.sk, Q1 2026) a dáta NBS/Bencont (Bratislava staršie byty 4 222 €/m², Q4 2025). Nájmy: Deloitte Rent Index Q4 2025 (priemer SR 749 €/mes., Bratislava 969 €, Trenčín 551 €), orientačná mesačná suma vrátane bežných energií. Model: nájom rastie priemerne o 3 % ročne, náklady o 2 % ročne, obsadenosť 11 mesiacov v roku. Historické miery rastu sú približné 10-ročné CAGR. Nezohľadňuje daň z príjmu z prenájmu, rekonštrukcie ani neobsadenosť nad rámec modelu. Modelový prepočet — historické výnosy nie sú zárukou budúcich. Nejde o investičné odporúčanie." +
        "</p>" +
      "</div>";
  }

  function update() {
    var data = compute();
    var Y = data.Y;
    var K = data.K;

    var heroY = root.querySelector("[data-iby-years-hero]");
    if (heroY) heroY.textContent = Y + " rokov";

    var krajLabel = root.querySelector("[data-iby-kraj-label]");
    if (krajLabel) krajLabel.textContent = K.name + " (" + kraj + ")";

    root.querySelectorAll("[data-iby-kraj]").forEach(function (el) {
      el.classList.toggle("active", el.getAttribute("data-iby-kraj") === kraj);
    });

    root.querySelectorAll("[data-iby-typ]").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-iby-typ") === typ);
    });

    var autoCards = root.querySelector("[data-iby-auto-cards]");
    var customCards = root.querySelector("[data-iby-custom-cards]");
    if (typ === "X") {
      if (autoCards) autoCards.style.display = "none";
      if (customCards) customCards.style.display = "";
      setIfUnfocused(root.querySelector("[data-iby-custom-price]"), customPrice);
      setIfUnfocused(root.querySelector("[data-iby-custom-rent]"), customRent);
    } else {
      if (autoCards) {
        autoCards.style.display = "";
        autoCards.innerHTML =
          '<div class="bg-background border border-border rounded-[14px] p-[22px] text-left">' +
            '<div class="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">Cena bytu</div>' +
            '<div class="text-[clamp(22px,3.4vw,30px)] font-black text-foreground mt-1">' + fmt(autoPrice(kraj, typ)) + "</div>" +
            '<div class="text-[11.5px] text-muted-foreground font-semibold mt-1.5 leading-relaxed">~' + TYPY[typ].m + " m² × " + Math.round(K.m2 * TYPY[typ].pk).toLocaleString("sk-SK") + " €/m² · " + K.name + "</div>" +
          "</div>" +
          '<div class="bg-background border border-border rounded-[14px] p-[22px] text-left">' +
            '<div class="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">Priemerný nájom (aj s energiami)</div>' +
            '<div class="text-[clamp(22px,3.4vw,30px)] font-black text-foreground mt-1">' + fmt(autoRent(kraj, typ)) + ' <span class="text-[14px] font-bold text-muted-foreground">/mes.</span></div>' +
            '<div class="text-[11.5px] text-muted-foreground font-semibold mt-1.5 leading-relaxed">priemer · ' + K.name + ' <em class="not-italic text-primary font-bold">(nájom zvyšujeme priemerne o cca 3 % ročne)</em></div>' +
          "</div>";
      }
      if (customCards) customCards.style.display = "none";
    }

    setIfUnfocused(root.querySelector("[data-iby-costm]"), costM);
    setIfUnfocused(root.querySelector("[data-iby-costy]"), costY);

    var growInp = root.querySelector("[data-iby-grow]");
    setIfUnfocused(growInp, grow);
    var growVal = root.querySelector("[data-iby-grow-val]");
    if (growVal) growVal.textContent = grow + " %";
    var growExtra = root.querySelector("[data-iby-grow-extra]");
    if (growExtra) {
      growExtra.innerHTML =
        'Historické tempo kraja (10 r.): <button type="button" data-iby-hist-grow class="text-[#5BC78A] underline underline-offset-2 cursor-pointer font-bold">' +
        pctFmt(K.hist) + " ← klikni a použijem ho</button>";
    }

    var yearsInp = root.querySelector("[data-iby-years]");
    setIfUnfocused(yearsInp, years);
    var yearsVal = root.querySelector("[data-iby-years-val]");
    if (yearsVal) yearsVal.textContent = years + " rokov";

    var mortCb = root.querySelector("[data-iby-mort]");
    if (mortCb && document.activeElement !== mortCb) mortCb.checked = useMort;

    var mortFields = root.querySelector("[data-iby-mort-fields]");
    if (mortFields) mortFields.style.display = useMort ? "" : "none";

    var eqInp = root.querySelector("[data-iby-equity]");
    setIfUnfocused(eqInp, equity);
    var eqVal = root.querySelector("[data-iby-equity-val]");
    if (eqVal) eqVal.textContent = equity + " % (" + fmt((data.price * equity) / 100) + ")";

    var rateInp = root.querySelector("[data-iby-rate]");
    setIfUnfocused(rateInp, mortRate);
    var rateVal = root.querySelector("[data-iby-rate-val]");
    if (rateVal) rateVal.textContent = mortRate + " %";

    var wealth = root.querySelector("[data-iby-wealth]");
    if (wealth) {
      var sub = useMort
        ? "Z vlastných " + fmt(data.vklad) + " → ×" + (data.vklad > 0 ? (data.wealth / data.vklad).toLocaleString("sk-SK", { maximumFractionDigits: 1 }) : "∞") + " · hodnota bytu + čisté nájmy − náklady − zostatok hypotéky"
        : "Hodnota bytu + čisté nájmy po nákladoch za " + Y + " rokov";
      wealth.innerHTML =
        '<div class="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#5BC78A]">Tvoj majetok o ' + Y + " rokov</div>" +
        '<div class="text-[clamp(38px,6vw,56px)] font-black leading-[1.05] mt-2 text-[#F5EDE0]">' + fmt(data.wealth) + "</div>" +
        '<div class="text-[14px] text-[#B8B2A4] font-semibold mt-2 leading-relaxed">' + sub + "</div>";
    }

    var cards = root.querySelector("[data-iby-rescards]");
    if (cards) {
      var html = resCard("Hodnota bytu o " + Y + " r.", fmt(data.VT));
      html += resCard("Nájmy spolu za " + Y + " r.", fmt(data.CF.najmy), "green");
      html += resCard("Náklady spolu za " + Y + " r. (správa, fond opráv, poistenie, daň)", "−" + fmt(data.CF.naklady), "red");
      if (useMort) html += resCard("Splátky hypotéky spolu za " + Y + " r.", "−" + fmt(data.CF.splatky), "red");
      html += resCard("Čistý výnos z nájmu dnes", pctFmt(data.yieldPct) + " p.a.");
      if (useMort) {
        html += resCard("Cashflow dnes (nájom − náklady − splátka)", (data.cfNow < 0 ? "−" : "+") + fmt(Math.abs(data.cfNow)) + "/mes.", data.cfNow < 0 ? "red" : "green");
      } else {
        html += resCard("Mesačná splátka", "0 € (bez hypotéky)");
      }
      cards.innerHTML = html;
    }

    chartWrap = root.querySelector("[data-iby-chart]");
    if (chartWrap) {
      chartWrap.innerHTML = chartSvg(data) + tooltipHtml(data);
    }

    var legend = root.querySelector("[data-iby-legend]");
    if (legend) {
      var items = [{ c: "#5BC78A", l: "Hodnota bytu (" + pctFmt(grow) + "/rok)" }];
      if (useMort) items.push({ c: "rgba(245,237,224,.5)", l: "Zostatok hypotéky ↓" });
      items.push({ c: "#D9A441", l: "Nájom ročne (+3 %/rok)" });
      items.push({ c: "#E08573", l: "Náklady ročne (+2 %/rok)" });
      legend.innerHTML = items.map(function (l) {
        return '<span class="flex items-center gap-2"><em class="not-italic inline-block w-[22px] h-1 rounded-sm" style="background:' + l.c + '"></em>' + l.l + "</span>";
      }).join("");
    }

    var tblSub = root.querySelector("[data-iby-tbl-sub]");
    if (tblSub) {
      tblSub.textContent = (typ === "X" ? "Vlastné zadanie" : TYPY[typ].name) + " · horizont " + Y + " rokov · historické tempo každého mesta";
    }
    var tblH = root.querySelector("[data-iby-tbl-h-val]");
    if (tblH) tblH.textContent = "Hodnota o " + Y + " r.";
    var tbody = root.querySelector("[data-iby-tbody]");
    if (tbody) tbody.innerHTML = tableRowsHtml(data);
  }

  function handleChartMove(clientX, clientY) {
    if (!chartWrap) return;
    var data = compute();
    var Y = data.Y;
    var rect = chartWrap.getBoundingClientRect();
    var svgEl = chartWrap.querySelector("svg");
    if (!svgEl) return;
    var svgRect = svgEl.getBoundingClientRect();
    var sx = ((clientX - svgRect.left) / svgRect.width) * W;
    var t = Math.round(((sx - P.l) / (W - P.l - P.r)) * Y);
    t = Math.max(0, Math.min(Y, t));
    hoverYear = t;
    tooltipPos = { x: clientX - rect.left, y: clientY - rect.top, flip: (clientX - rect.left) > rect.width * 0.55, containerW: rect.width };
    chartWrap.innerHTML = chartSvg(data) + tooltipHtml(data);
  }

  document.addEventListener("DOMContentLoaded", function () {
    root = document.getElementById("investicny-byt-root");
    if (!root) return;
    grow = defaultGrow(KRAJE.ZA.hist);
    buildShell();
    var mapEl = root.querySelector("[data-iby-map]");
    if (mapEl) mapEl.innerHTML = mapSvgHtml();
    update();

    root.addEventListener("click", function (e) {
      var kEl = e.target.closest("[data-iby-kraj]");
      if (kEl) { handleKrajClick(kEl.getAttribute("data-iby-kraj")); return; }
      var row = e.target.closest("[data-iby-row]");
      if (row) { handleKrajClick(row.getAttribute("data-iby-row")); return; }
      var tEl = e.target.closest("[data-iby-typ]");
      if (tEl) { handleTypClick(tEl.getAttribute("data-iby-typ")); return; }
      if (e.target.closest("[data-iby-hist-grow]")) {
        grow = KRAJE[kraj].hist;
        update();
      }
    });

    root.addEventListener("input", function (e) {
      var t = e.target;
      if (t.matches("[data-iby-custom-price]")) customPrice = +t.value;
      else if (t.matches("[data-iby-custom-rent]")) customRent = +t.value;
      else if (t.matches("[data-iby-costm]")) costM = +t.value;
      else if (t.matches("[data-iby-costy]")) costY = +t.value;
      else if (t.matches("[data-iby-grow]")) grow = +t.value;
      else if (t.matches("[data-iby-years]")) years = +t.value;
      else if (t.matches("[data-iby-equity]")) equity = +t.value;
      else if (t.matches("[data-iby-rate]")) mortRate = +t.value;
      else return;
      hoverYear = null;
      update();
    });

    root.addEventListener("change", function (e) {
      if (e.target.matches("[data-iby-mort]")) {
        useMort = e.target.checked;
        hoverYear = null;
        update();
      }
    });

    root.addEventListener("mousemove", function (e) {
      if (!e.target.closest("[data-iby-chart]")) return;
      handleChartMove(e.clientX, e.clientY);
    });
    root.addEventListener("mouseout", function (e) {
      if (chartWrap && !chartWrap.contains(e.relatedTarget) && (e.target === chartWrap || chartWrap.contains(e.target))) {
        hoverYear = null;
        update();
      }
    });
    root.addEventListener("touchmove", function (e) {
      if (!e.target.closest("[data-iby-chart]")) return;
      e.preventDefault();
      handleChartMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
    root.addEventListener("touchend", function () {
      hoverYear = null;
      update();
    });
  });
})();
